import { Schema, model } from "mongoose";
import { IEvents } from "../../../interfaces/index.js";

const eventsSchema = new Schema<IEvents>({
  categories_id: {
    type: Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
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
  date: {
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
