import { Schema, model } from "mongoose";
import { IPreference } from "../../../interfaces/index.js";
import { TModel } from "../../../types/index.js";
const preferencesSchema = new Schema<IPreference>({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  interests: [
    {
      title: {
        type: String,
        required: true,
      },
    },
  ],
});

const Preferences: TModel<IPreference> = model(
  "Preferences",
  preferencesSchema,
);

export default Preferences;
