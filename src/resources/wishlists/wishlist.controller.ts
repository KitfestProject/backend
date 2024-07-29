import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import wishlist_service from "./wishlist.service.js";
import crud from "../../utils/crud.js";
import Wishlists from "../../database/models/wishlists.js";

const create_wishlist = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const { event } = req.body;
    const response = await wishlist_service.create_wishlist(id, event);
    return res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res.status(500).end();
  }
};

const fetch_wishlist = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const response = await wishlist_service.fetch_wishlist(id);
    return res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res.status(500).end();
  }
};
const delete_wishlist = crud.deleteOne(Wishlists);

export default {
  create_wishlist,
  fetch_wishlist,
  delete_wishlist,
};
