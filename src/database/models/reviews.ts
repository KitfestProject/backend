import { Schema, model } from "mongoose";
import { IReviews } from "../../../interfaces/index.js";

const reviews_schema = new Schema<IReviews>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  event_id: {
    type: Schema.Types.ObjectId,
    ref: "Events",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const Reviews = model("Reviews", reviews_schema);
export default Reviews;
