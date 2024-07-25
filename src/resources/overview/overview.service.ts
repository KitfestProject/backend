import Events from "../../database/models/events.js";
import Tickets from "../../database/models/tickets.js";
import Transactions from "../../database/models/transactions.js";
import Users from "../../database/models/users.js";
import createResponse from "../../utils/response_envelope.js";

const fetch_stats = async (id: string, is_admin: boolean) => {
  let total_revenue = 0;
  let total_tickets_sold = 0;
  let total_events = 0;
  let total_users = 0;
  if (!is_admin) {
    const events = await Events.find({ organizer: id });
    const event_ids = events.map((event) => event._id);
    const tx = await Transactions.find({ events_id: { $in: event_ids } });
    total_tickets_sold = await Tickets.countDocuments({
      "event.id": { $in: event_ids },
    });
    total_events = events.length;
    total_revenue = tx.reduce((acc, tx) => acc + tx.amount, 0);
  } else {
    const transactions = await Transactions.find({});
    total_events = await Events.countDocuments({});
    total_users = await Users.countDocuments({});
    total_tickets_sold = await Tickets.countDocuments({});
    total_revenue = transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
  }

  const data = {
    total_revenue,
    total_tickets_sold,
    total_events,
    total_users,
  };

  return createResponse(true, "Overview stats fetched", data);
};

export default {
  fetch_stats,
};
