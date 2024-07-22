import { Schema, model } from "mongoose";
import { IVenues } from "../../../interfaces/index.js";

const venues_schema = new Schema<IVenues>({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  amenities: [
    {
      name: String,
      value: Boolean,
    },
  ],
  seat_map: {
    type: String,
  },
  seat_map_url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Venues = model("Venues", venues_schema);
export default Venues;
