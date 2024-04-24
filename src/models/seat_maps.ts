import { Schema, model } from "mongoose";
import { ISeatMaps } from "../../interfaces/index.js";

const seatMapSchema = new Schema<ISeatMaps>({
  events_id: {
    type: Schema.Types.ObjectId,
    ref: "Events",
    required: true,
  },
  total_capacity: {
    type: Number,
    required: true,
  },
  seats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Seats",
      required: true,
    },
  ],
});

const SeatMaps = model("SeatMaps", seatMapSchema);
export default SeatMaps;
