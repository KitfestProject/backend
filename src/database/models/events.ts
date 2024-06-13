import { Schema, model } from "mongoose";
import { IEvents } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";

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
  tickets: [],
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
  title: {
    type: String,
    required: true,
  },
  description: {
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
  tags: [
    {
      type: String,
    },
  ],
  cover_image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  event_date: {
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
  },
  event_start_time: {
    type: String,
    required: true,
  },
  event_end_time: {
    type: String,
    required: true,
  },
  is_paid: {
    type: String,
    enum: ["paid", "free"],
    required: true,
  },
  is_scheduled_published: {
    type: Boolean,
    default: false,
  },
  publication_date: {
    type: String,
    required: true,
  },
  publish_time: {
    type: String,
    required: true,
  },
});

const Events: TModel<IEvents> = model("Events", eventsSchema);
export default Events;
