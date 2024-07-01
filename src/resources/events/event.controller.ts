import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import files from "../../utils/file_upload.js";
import collection from "../../utils/collection.js";
import events_service from "./event.service.js";
import { IEvents } from "../../../interfaces/index.js";
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
    const response = await events_service.fetch_events();
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

const delete_event = crud.deleteOne(Events);

export default {
  create_event,
  fetch_events,
  fetch_one_event,
  delete_event,
};
