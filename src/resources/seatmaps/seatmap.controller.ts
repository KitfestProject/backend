import { Request, Response } from "express";
import seatmap_service from "./seatmap.service.js";
import logger from "../../utils/logging.js";

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

export default { create_seatmap_section };
