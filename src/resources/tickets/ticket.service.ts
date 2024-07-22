import Tickets from "../../database/models/tickets.js";
import createResponse from "../../utils/response_envelope.js";

const fetch_tickets = async (
  organizer: string,
  start: number,
  length: number,
  search: string,
) => {
  const tickets = await Tickets.find({
    organizer,
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  })
    .skip(start)
    .limit(length)
    .select("_id name  price quantity created_at");

  const total_records = await Tickets.countDocuments({ organizer });

  if (tickets.length < 1) {
    return createResponse(false, "No tickets found", null);
  }
  return createResponse(true, "Tickets found", { tickets, total_records });
};

export default { fetch_tickets };
