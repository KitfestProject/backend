import { IUsers } from "../../../interfaces/index.js";
import hashing from "../../utils/hashing.js";
import Users from "../../database/models/users.js";
import { get_current_date_time } from "../../utils/date_time.js";
import createResponse from "../../utils/response_envelope.js";
import { create_token } from "../../utils/jwt.js";
import { send_email } from "../../utils/email.js";

const create_user = async (user: IUsers) => {
  const user_exists = await get_user_by_email(user.email);
  if (user_exists.success) {
    return createResponse(false, "User already exists", null);
  }
  const hash_password = await hashing.hash_text(user.password);
  user.password = hash_password;
  const created_at = get_current_date_time();
  user.created_at = created_at;
  user.updated_at = created_at;
  const new_user = await Users.create(user);
  if (!new_user) {
    return createResponse(false, "Failed to create user", null);
  }
  const token = create_token({
    id: new_user._id.toString(),
    email: new_user.email,
    is_admin: new_user.is_admin,
  });
  //TODO: Admin should set up the message, from email
  const message = `Thank you for creating an account with us, we are super excited to have you. click this link <a href="https://thearter.ke">verify</a> to verify your email`;
  send_email(new_user.email, "Welcome to Theater.ke", message, new_user.name);
  const response_data = {
    token,
  };
  return createResponse(true, "User created successfully", response_data);
};

const get_user_by_email = async (email: string) => {
  const user = await Users.findOne({ email });
  if (!user) {
    return createResponse(false, "User not found", null);
  }
  return createResponse(true, "User found", user);
};

const sign_in = async (email: string, password: string) => {
  const user = await get_user_by_email(email);
  if (!user.success) {
    return user;
  }
  const is_password_valid = await hashing.compare_hash(
    password,
    user.data?.password!,
  );
  if (!is_password_valid) {
    return createResponse(false, "Invalid credentials", null);
  }
  const token = create_token({
    id: user.data?._id.toString()!,
    email: user.data?.email!,
    is_admin: user.data?.is_admin!,
  });
  const response_data = {
    token,
  };
  return createResponse(true, "User signed in successfully", response_data);
};

export default { create_user, get_user_by_email, sign_in };
