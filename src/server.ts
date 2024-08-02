import app from "./app.js";
import env_vars from "./config/env_vars.js";
import logger from "./utils/logging.js";

app.listen(5100, () =>
  logger.info(`Api running on port http://localhost:${env_vars.PORT}`),
);
