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
  price: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  seat_number: {
    type: Number,
    required: true,
  },
  is_paid: {
    type: Boolean,
    default: false,
  },
});

const Tickets = model("Tickets", ticketsSchema);
export default Tickets;
