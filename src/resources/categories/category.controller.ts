import { Request, Response } from "express";
import Categories from "../../database/models/categories.js";
import crud from "../../utils/crud.js";
import logger from "../../utils/logging.js";
import category_service from "./category.service.js";

const fetch_categories_admin = async (req: Request, res: Response) => {
  try {
    const { draw, start, length, search } = req.body;
    const value = search.value;
    const response = await category_service.fetch_categories_admin(
      Number(start),
      Number(length),
      value,
    );
    const { categories, total_records } = response.data;
    return res.status(200).json({
      draw,
      recordsTotal: total_records,
      recordsFiltered: total_records,
      data: categories,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const create_category = crud.createOne(Categories);
const get_categories = crud.getMany(Categories);
const get_category = crud.getOne(Categories);
const update_category = crud.updateOne(Categories);
const delete_category = crud.deleteOne(Categories);

export default {
  create_category,
  get_categories,
  get_category,
  update_category,
  delete_category,
  fetch_categories_admin,
};
