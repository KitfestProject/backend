import { Request, Response } from "express";
import { TModel } from "../../types/index.js";
import { Document } from "mongoose";
import createResponse from "./response_envelope.js";

const createOne =
  <T extends Document>(model: TModel<T>) =>
  async (req: Request, res: Response) => {
    try {
      const doc = await model.create(req.body);
      if (!doc) {
        return res
          .status(200)
          .json(createResponse(false, "Create failed", doc));
      }
      return res
        .status(201)
        .json(createResponse(true, "Created Successfully", doc));
    } catch (error) {}
  };
const getMany =
  <T extends Document>(model: TModel<T>) =>
  async (_: Request, res: Response) => {
    try {
      const docs = await model.find({});
      return res
        .status(200)
        .json(createResponse(true, "Data fetched Successfully", docs));
    } catch (error) {
      return res.status(500).json(error);
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
    } catch (error) {}
  };
const updateOne =
  <T extends Document>(model: TModel<T>) =>
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;
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
    } catch (error) {}
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
    } catch (error) {}
  };

export default { createOne, getMany, getOne, updateOne, deleteOne };
