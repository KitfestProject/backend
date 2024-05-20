import { Schema, model } from "mongoose";
import { ICategories } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";

const categoriesSchema = new Schema<ICategories>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Categories: TModel<ICategories> = model("Categories", categoriesSchema);
export default Categories;
