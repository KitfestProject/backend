import moment from "moment-timezone";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import fs from "fs";
import { send_email } from "../../utils/email.js";
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
  tickets: ITickets[];
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

const book_ticket = async (
  data: Booking,
  user_id: string,
  user_name: string,
) => {
  /*
  4. generate qr code
  5. send email to user
  6. send email to organizer
  */
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
  const event = await event_service.fetch_one_event(eventId);
  const event_data = event.data;
  if (!event_data) {
    logger.error("Event not found");
    return { success: false, message: "Could not proccess event" };
  }
  if (seats.length > 0) {
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
  } else {
    // update ticket quantity
  }

  const time = moment().tz("Africa/Nairobi").format("YYYY-MM-DD HH:mm:ss");
  const title = event.data.title;
  const organizer = event.data.organizer;

  console.log("data", data);
  console.log(amount, discount, seats.length);

  const ticket = await Tickets.create({
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
  });
  console.log(ticket);

  const transaction = await Transactions.create({
    ticket_id: ticket._id,
    user_id: user_id,
    events_id: eventId,
    amount,
    tx_processor: "Mpesa | Card",
    ref_code: tx_processor.reference,
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

  const pdf = generate_ticket_pdf(ticket, qr_code) as string;

  send_email(
    email,
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

function generate_ticket_pdf(ticket_data: ITickets, qr_code: string) {
  const output = `${ticket_data.id}-tickect.pdf`;
  const doc = new PDFDocument({
    size: "A6",
    margins: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  });

  doc.pipe(fs.createWriteStream(output));
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
  return output;
}

export default { book_ticket };
