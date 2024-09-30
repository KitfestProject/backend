import moment from "moment-timezone";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Schema } from "mongoose";
import { send_email, send_email_with_attachment } from "../../utils/email.js";
import { ISeats, ITickets, IUsers } from "../../../interfaces/index.js";
import Sections from "../../database/models/sections.js";
import Events from "../../database/models/events.js";
import Tickets from "../../database/models/tickets.js";
import event_service from "../events/event.service.js";
import logger from "../../utils/logging.js";
import Transactions from "../../database/models/transactions.js";
import createResponse from "../../utils/response_envelope.js";
import env_vars from "../../config/env_vars.js";
import userService from "../users/user.service.js";
import { utils } from "mocha";
import { verify_token } from "../../utils/jwt.js";

type Booking = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  updateMe: boolean;
  agree: boolean;
  eventId: string;
  amount: number;
  discount: number;
  paymentReference: string;
  tx_processor: paymentProcessorResponse;
  seats: Ticket[];
  tickets: Ticket[];
};

type Ticket = {
  id: string;
  seatNumber: number;
  discount: number;
  sectionAbr: string;
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  ticketType: string;
};
type paymentProcessorResponse = {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
  redirecturl: string;
};
type QRCodeData = {};

const book_ticket = async (data: Booking) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    // updateMe,
    // agree,
    eventId,
    amount,
    discount,
    tx_processor,
    seats,
    tickets,
  } = data;
  //check if user with the provided email exists

  const user = await userService.get_user_by_email(email);
  let user_id = user.data?._id;
  if (!user.success) {
    const password = Math.random().toString(36).slice(-8);
    const name = firstName + " " + lastName;
    const phone_number = phoneNumber;
    const user_data = {
      name,
      email,
      password,
      phone_number,
    } as IUsers;
    const new_user = await userService.create_user(user_data);
    if (new_user.success) {
      const token = new_user.data?.token;
      const decode_token = verify_token(token!);
      user_id = decode_token.id;
    } else {
      throw new Error("An error occured try again later");
    }
  }

  const event = await event_service.fetch_one_event(eventId);
  const event_data = event.data;
  if (!event_data) {
    logger.error("Event not found");
    return { success: false, message: "Could not proccess event" };
  }
  const time = moment().tz("Africa/Nairobi").format("YYYY-MM-DD HH:mm:ss");
  const title = event.data.title;
  const organizer = event.data.organizer;
  if (event_data.has_seat_map) {
    const seat_ids = seats.map((seat) => seat.id);
    await Sections.updateMany(
      {
        event_id: eventId,
      },
      {
        $set: {
          "rows.$[i].seats.$[j].status": "booked",
        },
      },
      {
        arrayFilters: [
          { "i.seats._id": { $in: seat_ids } },
          { "j._id": { $in: seat_ids } },
        ],
        multi: true,
      },
    );

    await handle_ticket_purchase(
      seats,
      user_id,
      eventId,
      title,
      organizer,
      time,
      tx_processor,
      event_data,
    );
  } else {
    let sold_out_message = null;
    for (const ticket of tickets) {
      const ticket_index = event_data.tickets.findIndex(
        (t) => t._id.toString() === ticket.id,
      );
      if (ticket_index !== -1) {
        const current_quantity =
          event_data.tickets[ticket_index].ticket_quantity;
        if (current_quantity === 0) {
          sold_out_message = `This ticket is sold out.`;
          break;
        } else {
          event_data.tickets[ticket_index].ticket_quantity -= 1;
        }
      }
    }
    if (sold_out_message) {
      return createResponse(false, sold_out_message, null);
    }
    await handle_ticket_purchase(
      tickets,
      user_id,
      eventId,
      title,
      organizer,
      time,
      tx_processor,
      event_data,
    );
  }
  return createResponse(true, "Ticket purchased, Check email", null);
};
async function handle_ticket_purchase(
  purchases: Ticket[],
  user_id: string,
  eventId: string,
  title: string,
  organizer: Schema.Types.ObjectId,
  time: string,
  tx_processor: paymentProcessorResponse | null,
  event_data: any,
) {
  purchases.map(async (purchase) => {
    const ticket = await Tickets.create({
      user_id,
      event: {
        id: eventId,
        title,
      },
      organizer,
      purchased_for: purchase.lastName + " " + purchase.firstName,
      ticket_price: purchase.amount,
      seat_number: purchase.seatNumber,
      ticket_type: purchase.ticketType || "General",
      purchased_at: time,
      ticket_discount_price: purchase.discount,
      ticket_quantity: 1, // This is always 1 for now
    });
    await Transactions.create({
      ticket_id: ticket._id,
      user_id,
      events_id: eventId,
      amount: purchase.amount,
      tx_processor: "Mpesa | Card",
      ref_code: tx_processor ? tx_processor.reference : "no_ref",
      time,
    });
    const qr_code_url = `${env_vars.VERIFY_QRCODE_URL}/${ticket._id}`;
    const qr_code = await generate_qr_code(qr_code_url);
    const pdf = (await generate_ticket_pdf(ticket, qr_code)) as string;
    send_email_with_attachment(
      purchase.email,
      "Ticket Purchase",
      "You have successfully purchased a ticket",
      purchase.firstName,
      pdf,
    );
    await Events.updateOne(
      { _id: eventId },
      {
        $push: {
          attendees: {
            first_name: purchase.firstName,
            last_name: purchase.lastName,
            email: purchase.email,
            phone_number: purchase.phoneNumber,
            ticket_type:
              purchase.seatNumber || purchase.ticketType || "General",
          },
        },
      },
    );
  });
}
async function generate_qr_code(qr_code_data: {}) {
  return await QRCode.toDataURL(JSON.stringify(qr_code_data));
}

function generate_ticket_pdf(
  ticket_data: ITickets,
  qr_code: string,
): Promise<string> {
  const dir = path.join(process.cwd(), "uploads", "bookings");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const output = path.join(dir, `${ticket_data.id}-tickect.pdf`);
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A6",
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
    });
    const write_stream = fs.createWriteStream(output);
    doc.pipe(write_stream);
    doc
      .rect(25, 25, doc.page.width - 50, doc.page.height - 50)
      .strokeColor("#732e1c")
      .lineWidth(2)
      .stroke();

    doc
      .fontSize(20)
      .text("Ticket Information", {
        align: "center",
      })
      .moveDown(1);

    doc.fontSize(11);
    const details = [
      `Name: ${ticket_data.ticket_type}`,
      `Event: ${ticket_data.event.title}`,
      `Date: ${ticket_data.purchased_at}`,
      `Seat: ${ticket_data.seat_number}`,
    ];

    details.forEach((detail) => {
      doc.text(detail, {
        align: "left",
      });
    });
    doc.moveDown(2);
    const qrImageSize = 150;
    doc.image(qr_code, (doc.page.width - qrImageSize) / 2, doc.y, {
      fit: [qrImageSize, qrImageSize],
      align: "center",
      valign: "center",
    });

    doc.fontSize(8).text("Scan QR code at the entrance © Theater.ke", {
      align: "center",
    });

    doc.end();
    write_stream.on("finish", () => {
      resolve(output);
    });

    write_stream.on("error", (err) => {
      logger.error("Error writing ticket pdf", err);
      reject(err);
    });
  });
}
const verify_qr_code = async (ticket_id: string) => {
  const ticket = await Tickets.findOne({ _id: ticket_id })
    .populate("event.id")
    .populate("user_id");
  if (!ticket) {
    return createResponse(false, "Invalid ticket", null);
  }
  if (ticket.validated.status) {
    return createResponse(
      false,
      `Ticket already validated at ${ticket.validated.validated_at}`,
      null,
    );
  }
  ticket.validated.status = true;
  ticket.validated.validated_at = moment()
    .tz("Africa/Nairobi")
    .format("YYYY-MM-DD HH:mm:ss");

  await ticket.save();
  const data = {
    ticket_type: ticket.ticket_type,
    seat_number: ticket.seat_number,
    //@ts-ignore
    event: ticket.event.id.title,
    validated_at: ticket.validated.validated_at,
  };
  return createResponse(true, "Ticket validated", data);
};

export default { book_ticket, verify_qr_code };
