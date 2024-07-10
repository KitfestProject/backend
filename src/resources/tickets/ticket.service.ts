import Tickets from "../../database/models/tickets.js";
import createResponse from "../../utils/response_envelope.js";

const fetch_tickets = async (organizer: string) => {
  const tickets = await Tickets.find({ organizer });
  if (tickets.length < 1) {
    return createResponse(false, "No tickets found", null);
  }
  return createResponse(true, "Tickets found", tickets);
};

export default { fetch_tickets };
