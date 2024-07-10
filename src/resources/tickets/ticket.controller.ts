import { Request, Response } from "express";
import ticket_service from "./ticket.service.js";
import logger from "../../utils/logging.js";

const fetch_tickets = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const tickets = await ticket_service.fetch_tickets(id);
    return res.status(200).json(tickets);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

export default {
  fetch_tickets,
};
