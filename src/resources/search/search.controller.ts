import { Request, Response } from "express";
import search_service from "./search.service.js";
import logger from "../../utils/logging.js";

const serch_events_and_artists = async (req: Request, res: Response) => {
  try {
    const { search } = req.body;
    const results = await search_service.search_event_or_artist(search);
    return res.status(200).json(results);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

export default {
  serch_events_and_artists,
};
