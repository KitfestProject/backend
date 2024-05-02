import express, { Request, Response } from "express";
import cors from "cors";
import { format, transports } from "winston";
import env_vars from "./config/env_vars.js";
import logger from "./utils/logging.js";

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

app.use("/", (_: Request, res: Response) => {
  return res.json({ links: ["https://theater.ke"] });
});

export default app;
