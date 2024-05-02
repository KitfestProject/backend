import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: "theater.ke-backend" },
  transports: [
    new transports.File({ filename: "logs/errors.log", level: "error" }),
    new transports.File({ filename: "logs/info.log" }),
  ],
});

export default logger;
