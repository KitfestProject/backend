import express from "express";
import cors from "cors";
import { format, transports } from "winston";
import env_vars from "./config/env_vars.js";
import logger from "./utils/logging.js";
import api from "./api/index.js";
import db from "./database/index.js";

const app = express();

app.use(express.json());
app.use(cors());

if (env_vars.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}
await db.start_mongodb(env_vars.MONGODB_URI);

app.use("/api/v1", api);

export default app;
