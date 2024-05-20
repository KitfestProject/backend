import { Schema, model } from "mongoose";
import { IEvents } from "../../../interfaces/index.js";

const eventsSchema = new Schema<IEvents>({
  category: {
    type: Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  venue: {
    type: Schema.Types.ObjectId,
    ref: "Venues",
    required: true,
  },
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tickets",
    },
  ],
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
  attendees: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  starts_on: {
    type: String,
    required: true,
  },
  ends_on: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  videos: [
    {
      type: String,
    },
  ],
});

const Events = model("Events", eventsSchema);
export default Events;
