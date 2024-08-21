import createResponse from "../../utils/response_envelope.js";
import Categories from "../../database/models/categories.js";

const fetch_categories_admin = async (
  start: number,
  length: number,
  search: string,
) => {
  const categories = await Categories.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  })
    .skip(start)
    .limit(length)
    .select("_id name description")
    .sort({ created_at: -1 });
  const total_records = await Categories.countDocuments();
  return createResponse(true, "Categories fetched successfully", {
    categories,
    total_records,
  });
};

export default { fetch_categories_admin };
