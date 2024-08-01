import Artists from "../../database/models/artists.js";
import Events from "../../database/models/events.js";
import createResponse from "../../utils/response_envelope.js";

const search_event_or_artist = async (search: string) => {
  const [_events, _artists] = await Promise.all([
    Events.find({
      $or: [{ title: { $regex: search, $options: "i" } }],
    }),
    Artists.find({
      $or: [{ name: { $regex: search, $options: "i" } }],
    }).populate({
      path: "category",
      select: "name",
    }),
  ]);
  const events = _events.map((event) => ({
    id: event._id,
    title: event.title,
    image: event.cover_image,
    date: event.event_date.start_date,
  }));
  const artists = _artists.map((artist) => ({
    id: artist._id,
    name: artist.name,
    image: artist.image,
    //@ts-ignore
    category: artist.category || "No category",
  }));
  return createResponse(true, "Here is your results!", { events, artists });
};
export default {
  search_event_or_artist,
};
