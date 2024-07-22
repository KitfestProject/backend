import { ISeats, IVenues } from "../../../interfaces/index.js";
import Venues from "../../database/models/venues.js";
import Seats from "../../database/models/seats.js";
import Sections from "../../database/models/sections.js";
import createResponse from "../../utils/response_envelope.js";
import collection from "../../utils/collection.js";

const create_venue = async (venue: IVenues) => {
  const venue_data = collection.convert_keys(venue);
  const new_venue = await Venues.create(venue_data);
  return createResponse(true, "Venue created successfully", new_venue);
};

const add_venue_section = async (
  venue_id: string,
  name: string,
  seats: ISeats[],
) => {
  const created_seats = await Seats.insertMany(seats);
  const seat_ids = created_seats.map((seat) => seat._id);

  const new_section = await Sections.create({ name, seats: seat_ids });

  const updated_venue = await Venues.findOneAndUpdate(
    { _id: venue_id },
    { $push: { sections: new_section._id } },
    { returnDocument: "after" },
  );

  if (!updated_venue) {
    return createResponse(false, "Venue not found", null);
  }

  return createResponse(true, "Section added to venue", new_section);
};
const fetch_venue_admin = async () => {
  const venues = await Venues.find().select("_id name");
  return createResponse(true, "Venues fetched successfully", venues);
};

export default { create_venue, add_venue_section, fetch_venue_admin };
