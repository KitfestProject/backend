import { Schema, model } from "mongoose";
import { IContact } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";

const contact_schema = new Schema<IContact>({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const Contacts: TModel<IContact> = model("Contacts", contact_schema);
export default Contacts;
