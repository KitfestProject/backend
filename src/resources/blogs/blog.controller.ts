import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import blogs_service from "./blog.service.js";
import { IJwtPayload } from "../../../interfaces/index.js";
import crud from "../../utils/crud.js";
import Blogs from "../../database/models/blogs.js";

const create_blog = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { email, name, id } = req.user;

    data.author = id;
    const response = await blogs_service.create_blog(email, name, data);
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
const fetch_blogs = async (req: Request, res: Response) => {
  try {
    const { length, start, draw, search } = req.body;
    const response = await blogs_service.fetch_blogs(
      length,
      search.value,
      start,
    );
    if (!response.success) {
      return res.status(400).json(response);
    }
    const response_data = {
      draw,
      recordsTotal: response.data?.total_records,
      recordsFiltered: response.data?.total_records,
      data: response.data?.blogs,
    };
    return res.status(200).json(response_data);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const fetch_blogs_users = async (req: Request, res: Response) => {
  try {
    const { length, start } = req.query;
    const response = await blogs_service.fetch_blogs_users(
      Number(length),
      Number(start),
    );
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
const change_blog_status = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await blogs_service.change_blog_status(id);
    return res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).end();
  }
};
const blog_stats = async (req: Request, res: Response) => {
  try {
    const response = await blogs_service.blogs_stats();
    return res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    return res.status(500).end();
  }
};
const fetch_blog = crud.getOne(Blogs);
const update_blog = crud.updateOne(Blogs);
const delete_blog = crud.deleteOne(Blogs);

export default {
  create_blog,
  fetch_blogs,
  fetch_blog,
  update_blog,
  delete_blog,
  fetch_blogs_users,
  change_blog_status,
  blog_stats,
};
