import { Request, Response } from "express";
import ticket_service from "./ticket.service.js";
import logger from "../../utils/logging.js";

const fetch_tickets = async (req: Request, res: Response) => {
  try {
    const { id, is_admin } = req.user;
    const { length, start, draw, search } = req.body;

    const response = await ticket_service.fetch_tickets(
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
      data: response.data?.tickets,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

export default {
  fetch_tickets,
};
