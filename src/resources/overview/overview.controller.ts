import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import over_view from "./overview.service.js";

const fetch_stats = async (req: Request, res: Response) => {
  try {
    const { id, is_admin } = req.user;
    const response = await over_view.fetch_stats(id, is_admin);
    return res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res.status(500).end();
  }
};

export default {
  fetch_stats,
};
