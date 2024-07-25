import { IUsers } from "../../../interfaces/index.js";
import hashing from "../../utils/hashing.js";
import Users from "../../database/models/users.js";
import { get_current_date_time } from "../../utils/date_time.js";
import createResponse from "../../utils/response_envelope.js";
import { create_token } from "../../utils/jwt.js";
import { send_email } from "../../utils/email.js";
import env_vars from "../../config/env_vars.js";

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
    name: new_user.name,
    email: new_user.email,
    is_admin: new_user.is_admin,
  });
  const verification_link = `${env_vars.EMAIL_VERIFICATION_URL}?token=${token}`;
  const message = `Thank you for creating an account with us, we are super excited to have you. click this link <a href=${verification_link}>verify</a> to verify your email`;
  send_email(new_user.email, "Welcome to Theater.ke", message, new_user.name);
  let role = "user";
  if (new_user.is_admin) {
    role = "admin";
  }
  const response_data = user_response(
    new_user.name,
    new_user.email,
    role,
    token,
    "User created successfully",
  );
  return response_data;
};

const get_user_by_email = async (email: string) => {
  const user = await Users.findOne({ email });
  if (!user) {
    return createResponse(false, "User not found", null);
  }
  return createResponse(true, "User found", user);
};

const update_user = async (id: string, user: IUsers) => {
  const updated_at = get_current_date_time();
  user.updated_at = updated_at;
  const updated_user = await Users.findOneAndUpdate({ _id: id }, user, {
    returnDocument: "after",
  });
  if (!updated_user) {
    return createResponse(false, "Failed to update user", null);
  }
  return createResponse(true, "User updated successfully", updated_user);
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
    name: user.data?.name!,
    email: user.data?.email!,
    is_admin: user.data?.is_admin!,
  });
  let role = "user";
  if (user.data?.is_admin) {
    role = "admin";
  }
  const response_data = user_response(
    user.data?.name!,
    user.data?.email!,
    role,
    token,
    "User signed in successfully",
  );
  return response_data;
};

const verify_user = async (id: string) => {
  const update_query = { is_verified: true } as IUsers;
  const verify = await update_user(id, update_query);
  if (!verify.success) {
    verify.message = "Failed to verify user";
    return verify;
  }
  verify.message = "Verification successfully";
  verify.data = null;
  return verify;
};
const user_response = (
  name: string,
  email: string,
  role: string,
  token: string,
  message: string,
) => {
  return createResponse(true, message, { name, email, role, token });
};
const fetch_users = async (
  draw: number,
  start: number,
  length: number,
  search: string,
) => {
  const total_records = await Users.countDocuments();
  const total_records_with_filter = await Users.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  });
  const users = await Users.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  })
    .skip(start)
    .limit(length)
    .select("_id email name is_admin is_organizer created_at")
    .sort({ created_at: -1 });
  users.forEach((user) => {
    if (user.is_organizer) {
      user.role = "organizer";
    } else if (user.is_admin) {
      user.role = "admin";
    } else {
      user.role = "user";
    }
  });

  const transformed_users = users.map((user) => {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
    };
  });

  if (!users) {
    return createResponse(false, "Failed to fetch users", null);
  }
  return createResponse(true, "Users fetched successfully", {
    users: transformed_users,
    total_records,
    total_records_with_filter: total_records_with_filter.length,
    draw,
  });
};

export default {
  create_user,
  get_user_by_email,
  sign_in,
  update_user,
  verify_user,
  fetch_users,
};
