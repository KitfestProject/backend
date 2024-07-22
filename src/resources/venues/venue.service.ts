import { IVenues } from "../../../interfaces/index.js";
import Venues from "../../database/models/venues.js";
import createResponse from "../../utils/response_envelope.js";
import collection from "../../utils/collection.js";

const create_venue = async (venue: IVenues) => {
  const venue_data = collection.convert_keys(venue);
  const new_venue = await Venues.create(venue_data);
  return createResponse(true, "Venue created successfully", new_venue);
};

const fetch_venue_admin = async () => {
  const venues = await Venues.find().select("_id name");
  return createResponse(true, "Venues fetched successfully", venues);
};

export default { create_venue, fetch_venue_admin };
