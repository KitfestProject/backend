import { IEventQuery, IEvents, ITickets } from "../../../interfaces/index.js";
import Tickets from "../../database/models/tickets.js";
import Events from "../../database/models/events.js";
import { get_current_date_time } from "../../utils/date_time.js";
import createResponse from "../../utils/response_envelope.js";

const create_event = async (event: IEvents) => {
  const current_date_time = get_current_date_time();

  const tickets_promise = event.tickets.map(async (ticket: ITickets) => {
    return await Tickets.create({
      ...ticket,
      organizer: event.organizer,
      purchased_at: current_date_time,
    });
  });
  const tickets = await Promise.all(tickets_promise);
  const new_event = await Events.create({
    ...event,
    tickets,
  });
  if (!new_event) {
    return createResponse(false, "Could not create event", null);
  }
  const _event = {
    id: new_event._id,
    title: new_event.title,
  };
  await Tickets.updateMany(
    { _id: { $in: tickets.map((ticket) => ticket._id) } },
    { event: _event },
  );
  return createResponse(true, "Event created successfully", new_event);
};

const fetch_events = async (query: IEventQuery) => {
  const events = await Events.aggregate([
    {
      $match: {
        $and: [
          query.date ? { "event_date.start_date": query.date } : {},
          query.paid ? { is_paid: query.paid } : {},
          query.location ? { location: query.location } : {},
        ],
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
    {
      $limit: query.limit ? query.limit : 6,
    },
    {
      $project: {
        title: 1,
        address: 1,
        description: 1,
        cover_image: 1,
        "event_date.start_date": 1,
      },
    },
  ]);

  if (!events) {
    return createResponse(false, "No events found", null);
  }
  return createResponse(true, "Events found", events);
};

const fetch_one_event = async (id: string) => {
  const event = await Events.findOne({ _id: id })
    .populate("category")
    .populate({
      path: "organizer",
      select: "name email",
    })
    .populate("venue");
  if (!event) {
    return createResponse(false, "Event not found", null);
  }
  return createResponse(true, "Event found", event);
};

export default { create_event, fetch_events, fetch_one_event };
