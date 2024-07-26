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
const fetch_users = async (req: Request, res: Response) => {
  try {
    const { draw, start, length, search } = req.body;
    const value = search.value;
    const response = await user_service.fetch_users(draw, start, length, value);
    const response_data = {
      draw: Number(draw),
      recordsTotal: response.data?.total_records,
      recordsFiltered: response.data?.total_records_with_filter,
      data: response.data?.users,
    };
    return res.status(200).json(response_data);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status;
  }
};
const user_dashboard = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const response = await user_service.user_dashboard(id);
    return res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const update_user = crud.updateOne(User);

const update_password = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const { old_password, new_password } = req.body;
    console.log(old_password, new_password);
    const response = await user_service.update_password(
      id,
      old_password,
      new_password,
    );
    return res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const fetch_my_tickets = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const response = await user_service.fetch_my_tickets(id);
    return res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
export default {
  sign_up,
  sign_in,
  verify_user,
  fetch_users,
  update_user,
  user_dashboard,
  update_password,
  fetch_my_tickets,
};
