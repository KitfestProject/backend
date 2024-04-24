import { Schema, model } from "mongoose";
import { ISeats } from "../../interfaces/index.js";

const seatsSchema = new Schema<ISeats>({
  raw: {
    type: Number,
    required: true,
  },
  column: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  is_taken: {
    type: Boolean,
    default: false,
  },
});

const Seats = model("Seats", seatsSchema);
export default Seats;
