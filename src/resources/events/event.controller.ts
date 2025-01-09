import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import collection from "../../utils/collection.js";
import events_service from "./event.service.js";
import { IEventQuery, IEvents } from "../../../interfaces/index.js";
import crud from "../../utils/crud.js";
import Events from "../../database/models/events.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import AWS from "aws-sdk";
import env_vars from "../../config/env_vars.js";
import files from "../../utils/file_upload.js";

const s3 = new AWS.S3({
  accessKeyId: env_vars.ACCESS_KEY_ID,
  secretAccessKey: env_vars.ACCESS_SECRET_KEY,
  endpoint: env_vars.ENDPOINT,
  region: env_vars.REGION,
  s3ForcePathStyle: true,
});

const create_event = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { id } = req.user;
    data.organizer = id;
    //Front end sends data in camelCase, convert to snake_case since all our schemas are in snake_case
    const convert_schema_keys = collection.convert_keys(data) as IEvents;
    const response = await events_service.create_event(convert_schema_keys);
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const fetch_events = async (req: Request, res: Response) => {
  try {
    for (let key in req.query) {
      if (req.query[key] === null || req.query[key] === "null") {
        req.query[key] = undefined;
      }
    }
    const { date, location, limit, paid, featured, start, past } = req.query;
    const query = {
      date: date as string,
      location: location as string,
      limit: parseInt(limit as string) as number,
      start: parseInt(start as string) as number,
      paid: paid as string,
      featured: featured as string,
      past: Boolean(past as string) as boolean,
    } as IEventQuery;
    const response = await events_service.fetch_events(query);
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
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const fetch_one_event_client = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await events_service.fetch_one_event_client(id);
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
const change_event_status = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { updateData } = req.body;
    const response = await events_service.change_event_status(id, updateData);
    return res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const download_event_attendees_pdf = async (req: Request, res: Response) => {
  const { id, event_show_id, show_time_id } = req.params;
  try {
    const response = await events_service.download_event_attendees(
      id,
      event_show_id,
      show_time_id,
    );
    return res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res.status(500).end();
  }
};

const update_event = async (req: Request, res: Response) => {
  try {
    const organizer = req.user.id;
    const { id } = req.params;
    const data = req.body as IEvents;
    const response = await events_service.update_event(organizer, id, data);
    return res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res.status(500).end();
  }
};
const fetch_advertisement_banners = async (req: Request, res: Response) => {
  try {
    const response = await events_service.fetch_advertisement_banners();
    return res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res.status(500).end();
  }
};

const delete_event = crud.deleteOne(Events);
export default {
  create_event,
  fetch_events,
  fetch_one_event,
  delete_event,
  fetch_events_admin,
  update_event,
  change_event_status,
  download_event_attendees_pdf,
  fetch_one_event_client,
  fetch_advertisement_banners,
};
