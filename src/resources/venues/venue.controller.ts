import { Request, Response } from "express";
import Venues from "../../database/models/venues.js";
import crud from "../../utils/crud.js";
import logger from "../../utils/logging.js";
import venues_service from "./venue.service.js";

const create_venue = async (req: Request, res: Response) => {
  try {
    const venue = req.body;
    const new_venue = await venues_service.create_venue(venue);
    if (!new_venue.success) {
      return res.status(400).json(new_venue);
    }
    return res.status(201).json(new_venue);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const add_venue_section = async (req: Request, res: Response) => {
  try {
    const { venue_id, name, seats } = req.body;
    const new_section = await venues_service.add_venue_section(
      venue_id,
      name,
      seats,
    );
    if (!new_section.success) {
      return res.status(400).json(new_section);
    }
    return res.status(201).json(new_section);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const get_venues = crud.getMany(Venues);
const get_venue = crud.getMany(Venues);
const remove_venue = crud.deleteOne(Venues);

export default {
  get_venues,
  get_venue,
  create_venue,
  add_venue_section,
  remove_venue,
};
