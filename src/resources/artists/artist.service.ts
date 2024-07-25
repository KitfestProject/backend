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
      { description: { $regex: search, $options: "i" } },
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
    description: artist.description,
    email: artist.email,
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

export default { fetch_artists_admin };
