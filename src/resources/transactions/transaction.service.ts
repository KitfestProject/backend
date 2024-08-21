import Transactions from "../../database/models/transactions.js";
import Events from "../../database/models/events.js";
import createResponse from "../../utils/response_envelope.js";
const fetch_transactions = async (
  organizer_id: string,
  is_admin: boolean,
  start: number,
  length: number,
  search: string,
) => {
  let transactions = [];
  let total_records = 0;
  if (!is_admin) {
    const events = await Events.find({ organizer: organizer_id });
    const event_ids = events.map((event) => event._id);
    transactions = await Transactions.find({
      events_id: { $in: event_ids },
      $or: [
        { ref_code: { $regex: search, $options: "i" } },
        { tx_processor: { $regex: search, $options: "i" } },
      ],
    })
      .populate("user_id", "name")
      .skip(start)
      .limit(length)
      .select("ref_code status amount time")
      .sort({ time: -1 });
    total_records = await Transactions.countDocuments({
      events_id: { $in: event_ids },
    });
  } else {
    transactions = await Transactions.find({
      $or: [
        { ref_code: { $regex: search, $options: "i" } },
        { tx_processor: { $regex: search, $options: "i" } },
      ],
    })
      .populate("user_id", "name")
      .skip(start)
      .limit(length)
      .select("ref_code status amount time")
      .sort({ time: -1 });
    total_records = await Transactions.countDocuments();
  }
  const tranformed_transactions = transactions.map((transaction) => ({
    ref_code: transaction.ref_code,
    status: "completed",
    amount: transaction.amount,
    time: transaction.time,
    //@ts-ignore
    user_name: transaction.user_id.name,
  }));

  if (transactions.length < 1) {
    return createResponse(false, "No transactions found", null);
  }
  return createResponse(true, "Transactions found", {
    transactions: tranformed_transactions,
    total_records,
  });
};
export default { fetch_transactions };
