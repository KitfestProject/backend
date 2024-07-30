import { IEventQuery, IEvents, ITickets } from "../../../interfaces/index.js";
import Tickets from "../../database/models/tickets.js";
import Events from "../../database/models/events.js";
import Venues from "../../database/models/venues.js";
import { get_current_date_time } from "../../utils/date_time.js";
import createResponse from "../../utils/response_envelope.js";
import { send_email } from "../../utils/email.js";
import logger from "../../utils/logging.js";

const create_event = async (event: IEvents) => {
  if (event.has_seat_map) {
    const [venue, new_event] = await Promise.all([
      Venues.findOne({ _id: event.venue }).select("name seat_map_url"),
      Events.create(event),
    ]);
    if (!venue) {
      throw new Error("Venue not found!");
    }
    const data = {
      event_id: new_event._id,
      venue,
    };
    return createResponse(true, "Proceed to adding seat prices", data);
  }
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
          query.featured ? { featured: query.featured } : {},
          { "event_date.start_date": { $gte: get_current_date_time() } },
          { status: "published" },
        ],
      },
    },
    {
      $sort: {
        "event_date.start_date": 1,
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
const fetch_events_admin = async (
  organizer_id: string,
  is_admin: boolean,
  start: number,
  length: number,
  search: string,
) => {
  let events = [];
  let total_records = 0;
  if (!is_admin) {
    events = await Events.find({
      organizer: organizer_id,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    })
      .skip(start)
      .limit(length)
      .sort({ "event_date.start_date": -1 })
      .select(
        "_id title description cover_image address status event_date.start_date",
      );

    total_records = await Events.countDocuments({
      organizer: organizer_id,
    });
    // const sold_tickets = await Tickets.countDocuments({
    //   "event.id": {
    //     $in: events.map((event) => event._id)
    //   },
    // });
  } else {
    events = await Events.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    })
      .skip(start)
      .limit(length)
      .sort({ "event_date.start_date": -1 })
      .select(
        "_id title description cover_image address status event_date.start_date",
      );

    total_records = await Events.countDocuments({});
  }

  const tranformed_events = events.map((event) => ({
    id: event._id,
    date: event.event_date.start_date,
    title: event.title,
    description: event.description,
    cover_image: event.cover_image,
    address: event.address,
    status: event.status,
  }));

  if (!events) {
    return createResponse(false, "No events found", null);
  }
  return createResponse(true, "Events found", {
    events: tranformed_events,
    total_records,
  });
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
const change_event_status = async (id: string, status: string) => {
  const event = await Events.findOne({ _id: id }).populate(
    "organizer",
    "name email",
  );
  if (!event) {
    return createResponse(false, "Event not found", null);
  }
  if (event.status === status) {
    return createResponse(false, `Event is already on status ${status}`, null);
  }
  const updated_event = await Events.findOneAndUpdate(
    { _id: id },
    { status },
    { returnDocument: "after" },
  );
  if (!updated_event) {
    return createResponse(false, "Could not update event status", null);
  }
  const sent_email = send_email(
    // @ts-ignore
    event.organizer.email,
    `Event ${status}`,
    `Your event ${event.title} has been ${status} successfully.`,
    // @ts-ignore
    event.organizer.name,
  );
  //@ts-ignore
  logger.info(`Email sent to ${event.organizer.email} ${sent_email}`);

  return createResponse(
    true,
    `Event status updated to ${status} successfully`,
    null,
  );
};

export default {
  create_event,
  fetch_events,
  fetch_one_event,
  fetch_events_admin,
  change_event_status,
};
