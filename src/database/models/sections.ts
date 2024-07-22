import { Schema, model } from "mongoose";
import { ISections } from "../../../interfaces/index.js";

const section_schema = new Schema<ISections>({
  event_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  abbr_name: {
    type: String,
    required: true,
  },
  full_sec_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rows: [
    {
      rowLabel: {
        type: String,
        required: true,
      },
      seats: [
        {
          id: {
            type: Number,
            required: true,
          },
          SN: {
            type: String,
          },
          column: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            default: 0,
          },
          discount: {
            type: Number,
            default: 0,
          },
          status: {
            type: String,
            enum: ["selected", "booked", "available"],
            required: true,
          },
        },
      ],
    },
  ],
});

const Sections = model("Sections", section_schema);
export default Sections;
