import { Schema, model } from "mongoose";
import { ISections } from "../../../interfaces/index.js";

const seatMapSchema = new Schema<ISections>({
  name: {
    type: "String",
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
