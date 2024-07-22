import { ISections } from "../../../interfaces/index.js";
import collection from "../../utils/collection.js";
import Sections from "../../database/models/sections.js";
import createResponse from "../../utils/response_envelope.js";

const create_seatmap_section = async (data: ISections) => {
  const section = await Sections.create(data);
  if (!section) {
    return createResponse(false, "Failed to create section", null);
  }
  return createResponse(true, "Section created succesfully", section);
};

export default { create_seatmap_section };
