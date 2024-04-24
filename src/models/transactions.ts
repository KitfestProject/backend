import { Schema, model } from "mongoose";
import { ITransaction } from "../../interfaces/index.js";

const transactionsSchema = new Schema<ITransaction>({
  ticket_id: {
    type: Schema.Types.ObjectId,
    ref: "Tickets",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  events_id: {
    type: Schema.Types.ObjectId,
    ref: "Events",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  tx_processor: {
    type: String,
    required: true,
  },
  ref_code: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const Transactions = model("Transactions", transactionsSchema);
export default Transactions;
