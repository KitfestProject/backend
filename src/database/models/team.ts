import { Schema, model } from "mongoose";
import { ITeamMembers } from "../../../interfaces";
import { TModel } from "../../../types/index.js";

const team = new Schema<ITeamMembers>({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  social_details: [{}],
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: true,
  },
});

const Team: TModel<ITeamMembers> = model("Team", team);
export default Team;
