import moment from "moment-timezone";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import ejs from "ejs";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { Schema } from "mongoose";
import { send_email, send_email_with_attachment } from "../../utils/email.js";
import {
  IEvents,
  IResponseEnvelope,
  ISeats,
  ITickets,
  IUsers,
} from "../../../interfaces/index.js";
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

type PdfData = {
  ticket_id: string;
  event_title: string;
  cover_image: string;
  event_date: string;
  event_time: string;
  buyers_name: string;
  ticket_type: string;
  ticket_price: number;
  allows: number;
  venue: string;
  qr_code: string;
  duration: string;
  start_time: string;
};

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
  eventShowId: string;
  showTimeId: string;
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
    eventShowId,
    showTimeId,
  } = data;
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
      eventShowId,
      showTimeId,
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
      eventShowId,
      showTimeId,
    );
    await event_data.save();
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
  event_data: IEvents,
  event_show_id: string,
  show_time_id: string,
) {
  purchases.map(async (purchase) => {
    const ticket = await Tickets.create({
      user_id,
      event: {
        id: eventId,
        title,
      },
      organizer,
      show_id: event_show_id,
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
    const show = event_data.shows.find(
      (show) => show._id.toString() === event_show_id,
    );
    const show_time = show?.shows.find(
      (show) => show._id.toString() === show_time_id,
    );
    if (!show_time) {
    }

    show_time!.bookings += 1;
    await event_data.save();
    const qr_code_url = `${env_vars.VERIFY_QRCODE_URL}/${ticket._id}/${event_show_id}/${show_time_id}`;
    const qr_code = await generate_qr_code(qr_code_url);
    const show_duration =
      (
        Number(show_time?.end_time!.split(":")[0]) -
        Number(show_time?.start_time!.split(":")[0])
      ).toString() + " hours";

    const pdf_data = {
      ticket_id: ticket._id,
      event_title: title,
      cover_image: event_data.cover_image,
      event_date: show!.date,
      event_time: show_time?.start_time,
      buyers_name: purchase.lastName + " " + purchase.firstName,
      ticket_type: purchase.ticketType || "General",
      ticket_price: purchase.amount,
      allows: 1,
      venue: event_data.address,
      qr_code,
      start_time: show_time?.start_time,
      duration: show_duration,
    } as PdfData;
    const pdf = await generate_ticket_pdf(pdf_data);
    send_email_with_attachment(
      purchase.email,
      "Ticket Purchase",
      "You have successfully purchased a ticket",
      purchase.firstName,
      pdf as string,
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

async function generate_ticket_pdf(
  pdf_data: PdfData,
): Promise<string | IResponseEnvelope<null>> {
  const dir = path.join(process.cwd(), "uploads", "bookings");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const output = path.join(dir, `${pdf_data.ticket_id}-ticket.pdf`);

  try {
    const __dirname = process.cwd();
    const templatePath = path.join(__dirname, "public", "e-ticket.ejs");
    const html = await ejs.renderFile(templatePath, pdf_data);
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({
      path: output,
      format: "A6",
      printBackground: true,
    });

    await browser.close();

    return output;
  } catch (error) {
    logger.error("Error generating PDF", error);
    return createResponse(false, "Error generating PDF", null);
  }
}
const verify_qr_code = async (
  ticket_id: string,
  event_show_id: string,
  show_time_id: string,
) => {
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
  const event_id = ticket.event.id;
  const event_data = await Events.findOne({ _id: event_id });
  if (!event_data) {
    return createResponse(false, "Event not found", null);
  }
  const show = event_data.shows.find(
    (show) => show._id.toString() === event_show_id,
  );
  const show_time = show?.shows.find(
    (show) => show._id.toString() === show_time_id,
  );
  if (!show_time) {
    logger.error("Show time not found");
  }
  show_time!.scan_count += 1;

  await Promise.all([ticket.save(), event_data.save()]);

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
