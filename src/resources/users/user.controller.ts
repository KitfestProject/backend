import { Request, Response } from "express";
import user_service from "./user.service.js";
import logger from "../../utils/logging.js";
import crud from "../../utils/crud.js";
import User from "../../database/models/users.js";

const sign_up = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const response = await user_service.create_user(user);
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(201).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const sign_in = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await user_service.sign_in(email, password);
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const verify_user = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const response = await user_service.verify_user(id);
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const fetch_users = crud.getMany(User);
const update_user = crud.updateOne(User);

export default { sign_up, sign_in, verify_user, fetch_users, update_user };
