import { Schema, model } from "mongoose";
import { IBlog } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";

const blog_schema = new Schema<IBlog>({
  category: {
    type: Schema.Types.ObjectId,
    ref: "Categories",
  },
  name: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cover_image: {
    type: String,
    required: true,
  },
  tags: [{ type: String }],
  content: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: true,
  },
});

const Blogs: TModel<IBlog> = model("Blogs", blog_schema);
export default Blogs;
