import Categories from "../../database/models/categories.js";
import crud from "../../utils/crud.js";

const create_category = crud.createOne(Categories);
const get_categories = crud.getMany(Categories);
const get_category = crud.getOne(Categories);
const update_category = crud.updateOne(Categories);
const delete_category = crud.deleteOne(Categories);

export default {
  create_category,
  get_categories,
  get_category,
  update_category,
  delete_category,
};
