import Wishlists from "../../database/models/wishlists.js";
import createResponse from "../../utils/response_envelope.js";
import Events from "../../database/models/events.js";

const create_wishlist = async (user: string, event: string) => {
  const existing_wishlist = await Wishlists.findOne({ user, event });
  if (existing_wishlist) {
    return createResponse(false, "Event already exists in wishlist", null);
  }
  const wishlist = await Wishlists.create({ user, event });
  if (!wishlist) {
    return createResponse(false, "Could not create wishlist", null);
  }
  const update_event = await Events.findOneAndUpdate(
    {
      _id: event,
    },
    {
      $inc: { wishlist_count: 1 },
    },
    { returnDocument: "after" },
  );
  if (!update_event) {
    return createResponse(false, "Could not update event", null);
  }
  const count = update_event.wishlist_count;
  return createResponse(true, "Wishlist created", { count });
};
const fetch_wishlist = async (user: string) => {
  const wishlists = await Wishlists.find({ user })
    .populate("event")
    .sort({ "event_date.start_date": -1 });

  if (!wishlists) {
    return createResponse(false, "No wishlists found", null);
  }
  const response_data = wishlists.map((wishlist: any) => ({
    id: wishlist.event._id,
    tittle: wishlist.event.title,
    start_date: wishlist.event.event_date.start_date,
    description: wishlist.event.description,
    image: wishlist.event.cover_image,
    address: wishlist.event.address,
  }));

  return createResponse(true, "Wishlists found", response_data);
};

export default { create_wishlist, fetch_wishlist };
