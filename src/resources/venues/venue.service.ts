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
const fetch_venues_admin = async (
  start: number,
  length: number,
  search: string,
) => {
  const venues = await Venues.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { address: { $regex: search, $options: "i" } },
    ],
  })
    .skip(start)
    .limit(length)
    .select("_id name address image capacity")
    .sort({ created_at: -1 });
  const total_records = await Venues.countDocuments();
  return createResponse(true, "Venues fetched successfully", {
    venues,
    filtered_records: venues.length,
    total_records,
  });
};
export default { create_venue, fetch_venue_admin, fetch_venues_admin };
