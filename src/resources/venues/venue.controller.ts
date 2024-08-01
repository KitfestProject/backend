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
      return res.status(200).json(new_venue);
    }
    return res.status(201).json(new_venue);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const fetch_venues = async (req: Request, res: Response) => {
  const venues = await venues_service.fetch_venue_admin();
  return res.status(200).json(venues);
};
const fetch_venues_admin = async (req: Request, res: Response) => {
  try {
    const { draw, start, length, search } = req.body;
    const value = search.value;
    const venues = await venues_service.fetch_venues_admin(
      Number(start),
      Number(length),
      value,
    );
    return res.status(200).json({
      draw,
      recordsTotal: venues.data.total_records,
      recordsFiltered: venues.data.filtered_records,
      data: venues.data.venues,
    });
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
  remove_venue,
  fetch_venues,
  fetch_venues_admin,
};
