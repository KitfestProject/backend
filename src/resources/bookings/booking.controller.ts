import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import booking_service from "./booking.service.js";

const book_ticket = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const response = await booking_service.book_ticket(data);
    return res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res.status(500).end();
  }
};
const verify_qr_code = async (req: Request, res: Response) => {
  try {
    const { id, event_show_id, show_time_id } = req.params;
    const response = await booking_service.verify_qr_code(
      id,
      event_show_id,
      show_time_id,
    );
    if (!response.success) {
      return res.render("error", {
        message: response.message,
      });
    }
    return res.render("ticket", {
      eventTitle: response.data?.event,
      ticketType: response.data?.ticket_type,
      validatedAt: response.data?.validated_at,
    });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res.status(500).end();
  }
};

export default {
  book_ticket,
  verify_qr_code,
};
