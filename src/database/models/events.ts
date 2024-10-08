import { Schema, model } from "mongoose";
import { IEvents } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";

const eventsSchema = new Schema<IEvents>(
  {
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
    wishlist_count: {
      type: Number,
      default: 0,
    },
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
    attendees: [{}],
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
    advertisement_banner: {
      type: String,
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
    has_seat_map: {
      type: Boolean,
      default: false,
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
    featured: {
      type: String,
      enum: ["enabled", "disabled"],
      default: "disabled",
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
    },
    publish_time: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "sold_out"],
      default: "draft",
    },
    is_advertisement: {
      type: String,
      enum: ["enabled", "disabled"],
      default: "disabled",
    },
    shows: [
      {
        date: {
          type: String,
          required: true,
        },
        shows: [
          {
            bookings: {
              type: Number,
              default: 0,
            },
            scan_count: {
              type: Number,
              default: 0,
            },
            start_time: {
              type: String,
              required: true,
            },
            end_time: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

const Events: TModel<IEvents> = model("Events", eventsSchema);
export default Events;
