import { Schema, model } from "mongoose";
import { Icategories } from "../../interfaces/index.js";

const categoriesSchema = new Schema<Icategories>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Categories = model("Categories", categoriesSchema);
export default Categories;
