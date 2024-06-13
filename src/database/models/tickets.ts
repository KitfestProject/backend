import { Schema, model } from "mongoose";
import { ITickets } from "../../../interfaces/index.js";

const ticketsSchema = new Schema<ITickets>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  // events_id: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Events",
  //   required: true,
  // },
  seat_id: {
    type: Schema.Types.ObjectId,
    ref: "Seats",
  },
  ticket_price: {
    type: Number,
    required: true,
  },
  seat_number: {
    type: Number,
  },
  ticket_type: {
    type: String,
  },
  purchased_at: {
    type: String,
    required: true,
  },
  ticket_discount_price: {
    type: Number,
    required: true,
  },
  ticket_quantity: {
    type: Number,
    required: true,
  },
  ticket_description: {
    type: String,
    required: true,
  },
  ticket_start_date: {
    type: String,
    required: true,
  },
  ticket_end_date: {
    type: String,
    required: true,
  },
  ticket_start_time: {
    type: String,
    required: true,
  },
  ticket_end_time: {
    type: String,
    required: true,
  },
});

const Tickets = model("Tickets", ticketsSchema);
export default Tickets;
