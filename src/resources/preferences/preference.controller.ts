import crud from "../../utils/crud.js";
import Preference from "../../database/models/preferences.js";

const create_preference = crud.createOne(Preference);
const get_preferences = crud.getMany(Preference);
const get_preference = crud.getOne(Preference);
const update_preference = crud.updateOne(Preference);
const delete_preference = crud.deleteOne(Preference);

export default {
  create_preference,
  get_preferences,
  get_preference,
  update_preference,
  delete_preference,
};
