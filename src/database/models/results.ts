import { Schema, model } from "mongoose";
import { IResults } from "../../../interfaces/index.js";

const resultsSchema = new Schema<IResults>({
  categories_id: {
    type: Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  artist_name: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
  },
  artist_image: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
});

const Results = model("Results", resultsSchema);
export default Results;
