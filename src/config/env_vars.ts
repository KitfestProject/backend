import { config } from "dotenv";
import logger from "../utils/logging.js";

config();

const { PORT, JWT_SECRET, NODE_ENV } = process.env;

if (!PORT || !JWT_SECRET || !NODE_ENV) {
  logger.info("Missing environment variables");
  process.exit(1);
}

export default { PORT, JWT_SECRET, NODE_ENV };
