import moment from "moment-timezone";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { send_email, send_email_with_attachment } from "../../utils/email.js";
import { ISeats, ITickets, IUsers } from "../../../interfaces/index.js";
import Sections from "../../database/models/sections.js";
import Events from "../../database/models/events.js";
import Tickets from "../../database/models/tickets.js";
import event_service from "../events/event.service.js";
import logger from "../../utils/logging.js";
import Transactions from "../../database/models/transactions.js";
import createResponse from "../../utils/response_envelope.js";

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

const book_ticket = async (
  data: Booking,
  user_id: string,
  user_name: string,
) => {
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
  const attendees_emails: string[] = [];
  const event = await event_service.fetch_one_event(eventId);
  const event_data = event.data;
  if (!event_data) {
    logger.error("Event not found");
    return { success: false, message: "Could not proccess event" };
  }

  if (event_data.has_seat_map) {
    const seat_ids = seats.map((seat) => seat.id);
    for (const seat of seats) {
      event_data.attendees.push({
        first_name: seat.firstName,
        last_name: seat.lastName,
        email: seat.email,
        phone_number: seat.phoneNumber,
        seat_number: seat.seatNumber,
        section_abr: seat.sectionAbr,
      });
      attendees_emails.push(seat.email);
    }
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
      event_data.attendees.push({
        first_name: ticket.firstName,
        last_name: ticket.lastName,
        email: ticket.email,
        phone_number: ticket.phoneNumber,
        ticket_type: ticket.ticketType,
      });
      attendees_emails.push(ticket.email);
    }

    if (sold_out_message) {
      return createResponse(false, sold_out_message, null);
    }
    const update_result = await Events.updateOne(
      { _id: eventId },
      { $set: { tickets: event_data.tickets } },
      { returnDocument: "after" },
    );

    logger.info("Event ticket purchase quantity updated", update_result);
  }

  const time = moment().tz("Africa/Nairobi").format("YYYY-MM-DD HH:mm:ss");
  const title = event.data.title;
  const organizer = event.data.organizer;

  const [ticket, _] = await Promise.all([
    Tickets.create({
      user_id,
      event: {
        id: eventId,
        title,
      },
      organizer,
      ticket_price: amount,
      seat_number: seats.map((seat) => seat.seatNumber) || null,
      ticket_type: "E-Ticket",
      purchased_at: time,
      ticket_discount_price: discount,
      ticket_quantity: seats.length || tickets.length,
    }),
    event_data.save(),
  ]);

  const transaction = await Transactions.create({
    ticket_id: ticket._id,
    user_id: user_id,
    events_id: eventId,
    amount,
    tx_processor: "Mpesa | Card",
    ref_code: tx_processor ? tx_processor.reference : "no_ref",
    time,
  });
  if (!ticket || !transaction) {
    logger.error("Could not create ticket");
    return { success: false, message: "Could not create ticket" };
  }
  //Should be a url the points to the backend
  const qr_code_data = {
    ticket_id: ticket._id,
    user_id,
    event_id: eventId,
    time,
  };

  const qr_code = await generate_qr_code(qr_code_data);

  const pdf = (await generate_ticket_pdf(ticket, qr_code)) as string;
  const emails = tickets.map((ticket) => ticket.email);
  await send_email_with_attachment(
    attendees_emails,
    "Ticket Purchase",
    "You have successfully purchased a ticket",
    user_name,
    pdf,
  );
  return createResponse(true, "Ticket purchased, Check email", null);
};

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
// const verify_qr_code = async (data: qrda) => {};

export default { book_ticket };
