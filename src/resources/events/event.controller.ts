import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import collection from "../../utils/collection.js";
import events_service from "./event.service.js";
import { IEventQuery, IEvents } from "../../../interfaces/index.js";
import crud from "../../utils/crud.js";
import Events from "../../database/models/events.js";

const create_event = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { id } = req.user;
    data.organizer = id;
    //Front end sends data in camelCase, convert to snake_case since all our schemas are in snake_case
    const convert_schema_keys = collection.convert_keys(data) as IEvents;
    const response = await events_service.create_event(convert_schema_keys);
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const fetch_events = async (req: Request, res: Response) => {
  try {
    const { date, location, limit, paid, featured } = req.query;
    const query = {
      date: date as string,
      location: location as string,
      limit: parseInt(limit as string) as number,
      paid: paid as string,
      featured: Boolean(featured as string) as boolean,
    } as IEventQuery;
    const response = await events_service.fetch_events(query);
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const fetch_one_event = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await events_service.fetch_one_event(id);
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const fetch_events_admin = async (req: Request, res: Response) => {
  try {
    const { id, is_admin } = req.user;
    const { length, start, draw, search } = req.body;

    const response = await events_service.fetch_events_admin(
      id,
      is_admin,
      start,
      length,
      search.value,
    );

    return res.status(200).json({
      draw,
      recordsTotal: response.data?.total_records,
      recordsFiltered: response.data?.total_records,
      data: response.data?.events,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const update_event = crud.updateOne(Events);

const delete_event = crud.deleteOne(Events);

export default {
  create_event,
  fetch_events,
  fetch_one_event,
  delete_event,
  fetch_events_admin,
  update_event,
};
