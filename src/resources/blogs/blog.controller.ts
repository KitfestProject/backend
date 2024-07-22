import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import blogs_service from "./blog.service.js";
import { IJwtPayload } from "../../../interfaces/index.js";
import crud from "../../utils/crud.js";
import Blogs from "../../database/models/blogs.js";

const create_blog = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const author = req.user as IJwtPayload;
    const response = await blogs_service.create_blog(author, data);
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
      recordsFiltered: response.data?.blogs,
      data: response.data?.blogs,
    };
    return res.status(200).json(response_data);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
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
};
