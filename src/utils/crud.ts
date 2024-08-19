import { Request, Response } from "express";
import { TModel } from "../../types/index.js";
import { Document } from "mongoose";
import createResponse from "./response_envelope.js";
import { get_current_date_time } from "./date_time.js";
import collection from "./collection.js";
import logger from "./logging.js";

const createOne =
  <T extends Document>(model: TModel<T>) =>
  async (req: Request, res: Response) => {
    try {
      let data = req.body;
      data = collection.convert_keys(data);
      const created_at = get_current_date_time();
      data.created_at = created_at;
      data.updated_at = created_at;
      const doc = await model.create(data);
      if (!doc) {
        return res
          .status(200)
          .json(createResponse(false, "Create failed", doc));
      }
      return res
        .status(201)
        .json(createResponse(true, "Created Successfully", doc));
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      return res.status(500).end();
    }
  };
const getMany =
  <T extends Document>(model: TModel<T>) =>
  async (req: Request, res: Response) => {
    try {
      const { start, limit } = req.query;
      const docs = await model
        .find({})
        .skip(Number(start))
        .limit(Number(limit));
      return res
        .status(200)
        .json(createResponse(true, "Data fetched Successfully", docs));
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      return res.status(500).end();
    }
  };
const getOne =
  <T extends Document>(model: TModel<T>) =>
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const doc = await model.findOne({ _id: id });
      if (!doc) {
        return res
          .status(200)
          .json(createResponse(false, "Document not found!", doc));
      }
      return res
        .status(200)
        .json(createResponse(true, "Data fetched Successfully!", doc));
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      return res.status(500).end();
    }
  };
const updateOne =
  <T extends Document>(model: TModel<T>) =>
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let data = req.body;
      data = collection.convert_keys(data);
      const updated_at = get_current_date_time();
      data.updated_at = updated_at;
      const doc = await model.findOneAndUpdate({ _id: id }, data, {
        returnDocument: "after",
      });
      if (!doc) {
        return res
          .status(200)
          .json(createResponse(false, "Update failed", doc));
      }
      return res
        .status(200)
        .json(createResponse(true, "Updated Successfully", doc));
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      return res.status(500).end();
    }
  };
const deleteOne =
  <T extends Document>(model: TModel<T>) =>
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const doc = await model.findOneAndDelete({ _id: id });
      if (!doc) {
        return res
          .status(200)
          .json(createResponse(false, "Delete failed", doc));
      }
      return res
        .status(200)
        .json(createResponse(true, "Deleted Successfully", doc));
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      return res.status(500).end();
    }
  };

export default { createOne, getMany, getOne, updateOne, deleteOne };
