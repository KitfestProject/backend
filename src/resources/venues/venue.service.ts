import { ISeats, IVenues } from "../../../interfaces/index.js";
import Venues from "../../database/models/venues.js";
import Seats from "../../database/models/seats.js";
import Sections from "../../database/models/sections.js";
import createResponse from "../../utils/response_envelope.js";
import logger from "../../utils/logging.js";

const create_venue = async (venue: IVenues) => {
  const new_venue = await Venues.create(venue);
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

const get_venue = async (venue_id: string) => {
  const venue = await Venues.findOne({ _id: venue_id }).populate("sections");
  if (!venue) {
    return createResponse(false, "Venue not found", null);
  }
  const sections = await Sections.find({
    _id: { $in: venue.sections },
  }).populate("seats");
  if (!sections) {
    logger.info("Error querying sections");
  }
  const section_response = sections.map((section) => {
    return {
      name: section.name,
      seats: section.seats,
    };
  });

  const response = {
    name: venue.name,
    location: venue.location,
    capacity: venue.capacity,
    Image: venue.image,
    sections: section_response,
  };

  return createResponse(true, "Venue fetched successfully", response);
};

export default { create_venue, add_venue_section, get_venue };
