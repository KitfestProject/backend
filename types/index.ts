import { Model, Document } from "mongoose";

export type TModel<T extends Document> = Model<T>;
