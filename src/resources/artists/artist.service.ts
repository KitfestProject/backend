import Artists from "../../database/models/artists.js";
import createResponse from "../../utils/response_envelope.js";

const fetch_artists_admin = async (
  start: number,
  length: number,
  search: string,
) => {
  const artists = await Artists.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ],
  })
    .skip(start)
    .limit(length)
    .sort({ name: -1 })
    .select("_id name created_at email description image");
  const total_records = await Artists.countDocuments({});

  const tranformed_artists = artists.map((artist) => ({
    id: artist._id,
    name: artist.name,
    email: artist.email,
    role: artist.role,
    image: artist.image,
    created_at: artist.created_at,
  }));
  if (artists.length < 1) {
    return createResponse(false, "No artists found", null);
  }
  return createResponse(true, "Artists found", {
    artists: tranformed_artists,
    total_records,
  });
};
const fetch_artists = async (start: number, limit: number) => {
  const artists = await Artists.find()
    .skip(start)
    .limit(limit)
    .sort({ name: -1 })
    .populate("category");

  const tranformed_artists = artists.map((artist) => ({
    id: artist._id,
    name: artist.name,
    image: artist.image,
    role: artist.role,
    //@ts-ignore
    category: artist.category ? artist.category.name : "No category",
  }));
  if (artists.length < 1) {
    return createResponse(false, "No artists found", null);
  }
  return createResponse(true, "Artists found", tranformed_artists);
};

export default { fetch_artists_admin, fetch_artists };
