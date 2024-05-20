import { Schema, model } from "mongoose";
import { IUsers } from "../../../interfaces/index.js";

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

const Users = model("Users", userSchema);
export default Users;
