import jwt from "jsonwebtoken";
import { IJwtPayload } from "../../interfaces/index.js";
import env_vars from "../config/env_vars.js";

const { sign, verify } = jwt;

const create_token = (payload: IJwtPayload): string => {
  return sign(payload, env_vars.JWT_SECRET);
};
const verify_token = (token: string): IJwtPayload => {
  return verify(token, env_vars.JWT_SECRET) as IJwtPayload;
};

export { create_token, verify_token };
