import mongoose from "mongoose";
import logger from "../utils/logging.js";

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

export default { start_mongodb };
