import { Schema, model } from "mongoose";
import { IUsers } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";

const userSchema = new Schema<IUsers>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  profile_picture: {
    type: String,
  },
  country: {
    type: String,
  },
  address: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  is_organizer: {
    type: Boolean,
    default: false,
  },
  organizer_request_status: {
    type: String,
    default: "",
  },
  organizer_name: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  preferences: [],
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: true,
  },
  last_login: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
});

const Users: TModel<IUsers> = model("Users", userSchema);
export default Users;
