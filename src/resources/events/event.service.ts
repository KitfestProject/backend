import { IEventQuery, IEvents, ITickets } from "../../../interfaces/index.js";
import Tickets from "../../database/models/tickets.js";
import Events from "../../database/models/events.js";
import Venues from "../../database/models/venues.js";
import { get_current_date_time } from "../../utils/date_time.js";
import createResponse from "../../utils/response_envelope.js";
import { send_email } from "../../utils/email.js";
import logger from "../../utils/logging.js";
import seatmap_service from "../seatmaps/seatmap.service.js";
import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";
import env_vars from "../../config/env_vars.js";
import files from "../../utils/file_upload.js";
import collection from "../../utils/collection.js";

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

const update_event = async (organizer: string, id: string, data: IEvents) => {
  const event = collection.convert_keys(data) as IEvents;
  const current_date_time = get_current_date_time();
  if (!event.has_seat_map) {
    const updated_tickets = await Promise.all(
      event.tickets.map(async (ticket) => {
        if (ticket._id) {
          const updated_ticket = await Tickets.findOneAndUpdate(
            { _id: ticket._id },
            {
              ...ticket,
            },
            { new: true },
          );
          if (!updated_ticket) {
            throw Error("An error occured - Updating ticket");
          }
          return updated_ticket;
        } else {
          return await Tickets.create({
            ...ticket,
            organizer,
            purchased_at: current_date_time,
          });
        }
      }),
    );

    event.tickets = updated_tickets;
  }
  const doc = await Events.findOneAndUpdate({ _id: id }, event, {
    returnDocument: "after",
  });
  if (!doc) {
    return createResponse(false, "Event not updated", null);
  }
  return createResponse(true, "Event updated successfully", doc);
};

const fetch_events = async (query: IEventQuery) => {
  let past_events = [];
  if (query.past) {
    past_events = await Events.aggregate([
      {
        $match: {
          $and: [
            query.date ? { "event_date.start_date": query.date } : {},
            query.paid ? { is_paid: query.paid } : {},
            query.location ? { location: query.location } : {},
            query.featured ? { featured: query.featured } : {},
            { "event_date.end_date": { $lt: get_current_date_time() } },
            { status: "published" },
          ],
        },
      },
      {
        $sort: {
          "event_date.start_date": -1,
        },
      },
      {
        $limit: query.limit ? query.limit : 6,
      },
      {
        $skip: query.start ? query.start : 0,
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
  }
  const events = await Events.aggregate([
    {
      $match: {
        $and: [
          query.date ? { "event_date.start_date": query.date } : {},
          query.paid ? { is_paid: query.paid } : {},
          query.location ? { location: query.location } : {},
          query.featured ? { featured: query.featured } : {},
          { "event_date.end_date": { $gte: get_current_date_time() } },
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
      $skip: query.start ? query.start : 0,
    },
    {
      $limit: query.limit ? query.limit : 12,
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
  let data;
  if (past_events.length < 1) {
    data = events;
  } else {
    data = {
      upcoming: events,
      past: past_events,
    };
  }
  return createResponse(true, "Events found", data);
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
const fetch_one_event_client = async (id: string) => {
  const event = await Events.findOne({ _id: id })
    .populate({
      path: "venue",
      select: "name address longitude latitude",
    })
    .select(
      "-reviews -attendees -images -videos -is_scheduled_published -publication_date -__v -publish_time -createdAt -updatedAt -tags -category",
    );
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
  if (status === "published" && event.has_seat_map) {
    const seat_map = await seatmap_service.fetch_sections(id);
    const seat_map_data = seat_map.data;
    const validate_seatmap = find_emptyobject_keys(seat_map_data!);
    if (validate_seatmap.length > 0) {
      await send_email(
        // @ts-ignore
        event.organizer.email,
        `Event could not be published`,
        `Your event ${event.title} could not be published, Reason:Event has sections without seatmap. kindly fill out all sections and try again`,
        // @ts-ignore
        event.organizer.name,
      );
      return createResponse(false, `Event has sections without seatmap`, null);
    }
  }
  const updated_event = await Events.findOneAndUpdate(
    { _id: id },
    { status },
    { returnDocument: "after" },
  );
  if (!updated_event) {
    return createResponse(false, "Could not update event status", null);
  }
  const sent_email = await send_email(
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

function find_emptyobject_keys(obj: Record<string, any>): string[] {
  return Object.keys(obj).filter((key) => {
    const value = obj[key];
    return (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    );
  });
}
const download_event_attendees = async (event_id: string) => {
  const event = await fetch_one_event(event_id);
  if (!event.success) {
    return event;
  }
  const event_attendees = event.data?.attendees!;
  const directory = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  const file_path = path.join(directory, `${event.data?.title}_attendees.pdf`);
  const doc = new PDFDocument({ size: "A3", layout: "portrait" });
  doc.pipe(fs.createWriteStream(file_path));

  doc.fontSize(25).text("Event Attendees", 50, 50);
  doc.fontSize(15).text("Event Name: " + event.data?.title, 50, 100);
  doc
    .fontSize(15)
    .text(
      "Event Date: " + event.data?.event_date.start_date.split("T")[0],
      50,
      130,
    );
  const columnWidths = {
    no: 50,
    firstName: 120,
    lastName: 120,
    email: 200,
    phone: 120,
    ticket: 150,
  };
  doc
    .fontSize(14)
    .text("No", 50, 180)
    .text("Firstname", 50 + columnWidths.no, 180)
    .text("Lastname", 50 + columnWidths.no + columnWidths.firstName, 180)
    .text(
      "Email",
      50 + columnWidths.no + columnWidths.firstName + columnWidths.lastName,
      180,
    )
    .text(
      "Phone",
      50 +
        columnWidths.no +
        columnWidths.firstName +
        columnWidths.lastName +
        columnWidths.email,
      180,
    )
    .text(
      "TT/SN",
      50 +
        columnWidths.no +
        columnWidths.firstName +
        columnWidths.lastName +
        columnWidths.email +
        columnWidths.phone,
      180,
    );
  doc.moveTo(50, 200).lineTo(800, 200).stroke();

  let current_y = 210;
  const sorted_attendees = event_attendees.sort((a: any, b: any) =>
    a.first_name.localeCompare(b.first_name),
  );
  sorted_attendees.forEach((attendee: any, index: number) => {
    if (index % 2 === 0) {
      doc
        .rect(50, current_y - 5, 750, 20)
        .fill("#e0e0e0")
        .fillColor("#000");
    } else {
      doc
        .rect(50, current_y - 5, 750, 20)
        .fill("#c18a73")
        .fillColor("#fff");
    }
    doc
      .fontSize(12)
      .text((index + 1).toString(), 50, current_y)
      .text(attendee.first_name, 50 + columnWidths.no, current_y)
      .text(
        attendee.last_name,
        50 + columnWidths.no + columnWidths.firstName,
        current_y,
      )
      .text(
        attendee.email,
        50 + columnWidths.no + columnWidths.firstName + columnWidths.lastName,
        current_y,
        { width: columnWidths.email, ellipsis: true },
      )
      .text(
        attendee.phone_number,
        50 +
          columnWidths.no +
          columnWidths.firstName +
          columnWidths.lastName +
          columnWidths.email,
        current_y,
      )
      .text(
        attendee.ticket_type || attendee.seat_number || "General",
        50 +
          columnWidths.no +
          columnWidths.firstName +
          columnWidths.lastName +
          columnWidths.email +
          columnWidths.phone,
        current_y,
      );
    current_y += 20;
  });
  doc.end();
  const file_stream = fs.createReadStream(file_path);
  const upload_params = {
    Bucket: env_vars.BUCKET,
    Key: path.basename(file_path),
    Body: file_stream,
    ACL: "public-read",
    ContentType: "application/pdf",
  };
  const upload_response = await files.s3.upload(upload_params).promise();
  if (!upload_response) {
    return createResponse(false, "Could not upload file", null);
  }
  const public_url = files.get_public_url(upload_params.Key);
  return createResponse(
    true,
    "Here is your link to download the pdf",
    public_url,
  );
};
export default {
  create_event,
  fetch_events,
  fetch_one_event,
  fetch_events_admin,
  change_event_status,
  download_event_attendees,
  update_event,
  fetch_one_event_client,
};
