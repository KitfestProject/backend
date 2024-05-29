import { Schema, model } from "mongoose";
import { ITickets } from "../../../interfaces/index.js";

const ticketsSchema = new Schema<ITickets>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  events_id: {
    type: Schema.Types.ObjectId,
    ref: "Events",
    required: true,
  },
  seat_id: {
    type: Schema.Types.ObjectId,
    ref: "Seats",
  },
  price: {
    type: Number,
    required: true,
  },
  seat_number: {
    type: Number,
    required: true,
  },
  ticket_type: {
    type: String,
  },
  purchased_at: {
    type: String,
    required: true,
  },
});

const Tickets = model("Tickets", ticketsSchema);
export default Tickets;
