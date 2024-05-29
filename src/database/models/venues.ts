import { Schema, model } from "mongoose";
import { IVenues } from "../../../interfaces/index.js";

const venues_schema = new Schema<IVenues>({
  sections: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sections",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  contact: {
    type: String,
    required: true,
  },
});

const Venues = model("Venues", venues_schema);
export default Venues;
