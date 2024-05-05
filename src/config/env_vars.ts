import { config } from "dotenv";
import logger from "../utils/logging.js";

config();

const {
  PORT,
  JWT_SECRET,
  NODE_ENV,
  MONGODB_URI,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} = process.env;

if (
  !PORT ||
  !JWT_SECRET ||
  !NODE_ENV ||
  !MONGODB_URI ||
  !REDIS_HOST ||
  !REDIS_PASSWORD ||
  !REDIS_PORT
) {
  logger.info("Missing environment variables");
  process.exit(1);
}

export default {
  PORT,
  JWT_SECRET,
  NODE_ENV,
  MONGODB_URI,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
};
