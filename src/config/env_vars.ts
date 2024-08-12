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
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_VERIFICATION_URL,
  ACCESS_KEY_ID,
  ACCESS_SECRET_KEY,
  REGION,
  ENDPOINT,
  BUCKET,
  VERIFY_QRCODE_URL,
} = process.env;

if (
  !PORT ||
  !JWT_SECRET ||
  !NODE_ENV ||
  !MONGODB_URI ||
  !REDIS_HOST ||
  !REDIS_PORT ||
  !EMAIL_USER ||
  !EMAIL_PASS ||
  !EMAIL_VERIFICATION_URL ||
  !ACCESS_KEY_ID ||
  !ACCESS_SECRET_KEY ||
  !REGION ||
  !ENDPOINT ||
  !BUCKET ||
  !VERIFY_QRCODE_URL
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
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_VERIFICATION_URL,
  ACCESS_KEY_ID,
  ACCESS_SECRET_KEY,
  REGION,
  ENDPOINT,
  BUCKET,
  VERIFY_QRCODE_URL,
};
