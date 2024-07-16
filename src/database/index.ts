import mongoose from "mongoose";
import logger from "../utils/logging.js";
import env_vars from "../config/env_vars.js";
import { Redis } from "ioredis";

const start_mongodb = async (uri: string) => {
  try {
    const client = await mongoose.connect(uri);
    logger.info(`
      Connected to MongoDB, Host: ${client.connection.host} Port: ${client.connection.port} Database: ${client.connection.name}
      `);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    process.exit(0);
  }
};

const redis_client = new Redis({
  host: env_vars.REDIS_HOST,
  port: parseInt(env_vars.REDIS_PORT),
  password: env_vars.REDIS_PASSWORD || "",
});
redis_client.on("connect", () => {
  logger.info("Connected to Redis");
});
redis_client.on("error", (error) => {
  logger.error(`Error connecting to Redis: ${error}`);
  process.exit(0);
});

export default { start_mongodb, redis_client };
