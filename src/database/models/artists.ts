import { Schema, model } from "mongoose";
import { IArtist } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";

const artist_schema = new Schema<IArtist>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  image: {
    type: String,
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

const Artists: TModel<IArtist> = model("Artist", artist_schema);
export default Artists;
