import { ITickets } from "../../../interfaces/index.js";
import Tickets from "../../database/models/tickets.js";
import createResponse from "../../utils/response_envelope.js";

const fetch_tickets = async (
  organizer: string,
  is_admin: boolean,
  start: number,
  length: number,
  search: string,
) => {
  let tickets = [];
  if (!is_admin) {
    tickets = await Tickets.find({
      organizer,
      $or: [
        { ticket_type: { $regex: search, $options: "i" } },
        { ticket_description: { $regex: search, $options: "i" } },
      ],
      user_id: { $ne: null },
    })
      .skip(start)
      .limit(length)
      .populate("user_id", "name")
      .select("_id event  ticket_price purchased_at seat_number")
      .sort({ purchased_at: -1 });
  } else {
    tickets = await Tickets.find({
      user_id: { $ne: null },
      $or: [
        { ticket_type: { $regex: search, $options: "i" } },
        { ticket_description: { $regex: search, $options: "i" } },
      ],
    })
      .skip(start)
      .limit(length)
      .sort({ purchased_at: -1 })
      .populate("user_id", "name")
      .select("_id event  ticket_price purchased_at seat_number purchased_for");
  }

  const tranformed_tickets = tickets
    .map((ticket: ITickets) => ({
      id: ticket._id,
      user_name:
        //@ts-ignore
        ticket.purchased_for || ticket.user_id ? ticket.user_id.name : "User",
      event_title: ticket.event.title,
      seat_number: ticket.seat_number.join(", "),
      ticket_price: ticket.ticket_price,
      purchased_at: ticket.purchased_at,
      time: ticket.purchased_at.split(" ")[1],
    }))
    .sort((a, b) => {
      return (
        new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime()
      );
    });

  const total_records = await Tickets.countDocuments({ organizer });
  return createResponse(true, "Tickets found", {
    tickets: tranformed_tickets,
    total_records,
  });
};

export default { fetch_tickets };
