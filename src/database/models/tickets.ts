import { Schema, model } from "mongoose";
import { ITickets } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";

const ticketsSchema = new Schema<ITickets>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  purchased_for: {
    type: String,
  },
  event: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "Events",
    },
    title: {
      type: String,
    },
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  seat_id: {
    type: Schema.Types.ObjectId,
    ref: "Seats",
  },
  ticket_price: {
    type: Number,
    required: true,
  },
  seat_number: [
    {
      type: String,
    },
  ],
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
  validated: {
    status: {
      type: Boolean,
      default: false,
    },
    validated_at: {
      type: String,
    },
  },
});

const Tickets: TModel<ITickets> = model("Tickets", ticketsSchema);
export default Tickets;
