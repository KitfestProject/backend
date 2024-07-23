import { Request, Response } from "express";
import seatmap_service from "./seatmap.service.js";
import logger from "../../utils/logging.js";
import crud from "../../utils/crud.js";
import Sections from "../../database/models/sections.js";

const create_seatmap_section = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const response = await seatmap_service.create_seatmap_section(data);
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const fetch_section = async (req: Request, res: Response) => {
  try {
    const response = await seatmap_service.fetch_sections(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const fetch_seatmap_section = crud.getMany(Sections);
export default { create_seatmap_section, fetch_seatmap_section, fetch_section };
