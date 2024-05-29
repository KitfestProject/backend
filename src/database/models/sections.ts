import { Schema, model } from "mongoose";
import { ISections } from "../../../interfaces/index.js";

const section_schema = new Schema<ISections>({
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

const Sections = model("Sections", section_schema);
export default Sections;
