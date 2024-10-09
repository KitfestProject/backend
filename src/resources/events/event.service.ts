import fs from "fs/promises";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";
import { IEventQuery, IEvents, ITickets } from "../../../interfaces/index.js";
import Tickets from "../../database/models/tickets.js";
import Events from "../../database/models/events.js";
import Venues from "../../database/models/venues.js";
import { get_current_date_time } from "../../utils/date_time.js";
import createResponse from "../../utils/response_envelope.js";
import { send_email } from "../../utils/email.js";
import logger from "../../utils/logging.js";
import seatmap_service from "../seatmaps/seatmap.service.js";
import PDFDocument from "pdfkit";
import env_vars from "../../config/env_vars.js";
import files from "../../utils/file_upload.js";
import collection from "../../utils/collection.js";

const create_event = async (event: IEvents) => {
  const is_advertisement = event.is_advertisement;
  is_advertisement
    ? (event.is_advertisement = "enabled")
    : (event.is_advertisement = "disabled");
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
          advertisement_banner: 1,
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
        advertisement_banner: 1,
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
        "_id title description cover_image address status event_date.start_date featured is_advertisement",
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
    featured: event.featured,
    is_advertisement: event.is_advertisement,
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
      "-reviews -attendees -images -videos -is_scheduled_published -publication_date -__v -publish_time -createdAt -updatedAt -tags -category -is_advertisement -featured",
    );
  if (!event) {
    return createResponse(false, "Event not found", null);
  }
  return createResponse(true, "Event found", event);
};
const change_event_status = async (
  id: string,
  data: { status: string; featured: string; is_advertisement: string },
) => {
  const event = await Events.findOne({ _id: id }).populate(
    "organizer",
    "name email",
  );
  if (!event) {
    return createResponse(false, "Event not found", null);
  }
  if (data.status === "published" && event.has_seat_map) {
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
    { $set: data },
    { returnDocument: "after" },
  );
  if (!updated_event) {
    return createResponse(false, "Could not update event status", null);
  }

  return createResponse(true, `Event updated successfully`, null);
};
const fetch_advertisement_banners = async () => {
  const events = await Events.find({
    status: "published",
    is_advertisement: "enabled",
  })
    .select("_id advertisement_banner")
    .limit(6);
  if (!events) {
    return createResponse(false, "No advertisement banners found", null);
  }
  return createResponse(true, "Advertisement banners found", events);
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
const download_event_attendees = async (
  event_id: string,
  event_show_id: string,
  show_time_id: string,
) => {
  const event = await fetch_one_event(event_id);
  if (!event.success) {
    return event;
  }

  const show = event.data?.event_shows.find(
    (show) => show._id.toString() == event_show_id,
  );
  if (!show) {
    return createResponse(false, "Show not found", null);
  }

  const show_time = show.shows.find(
    (show_time) => show_time._id.toString() == show_time_id,
  );
  if (!show_time) {
    return createResponse(false, "Show time not found", null);
  }

  const bookings = show_time.bookings;
  const scanned_tickets = show_time.scan_count;
  const event_attendees = show_time.attendees;

  const sorted_attendees = event_attendees.sort((a: any, b: any) =>
    a.first_name.localeCompare(b.first_name),
  );

  const templateData = {
    eventName: event.data?.title,
    //format date to human readable
    eventDate: new Date(show.date).toDateString(),
    showTime: show_time.start_time + " - " + show_time.end_time,
    totalBookedTickets: bookings,
    totalScannedTickets: scanned_tickets,
    attendees: sorted_attendees.map((attendee: any, index: number) => ({
      no: index + 1,
      firstName: attendee.first_name,
      lastName: attendee.last_name,
      email: attendee.email,
      phone: attendee.phone_number,
      ticketTypeOrSeatNumber: attendee.ticket_type_or_sn,
    })),
  };

  const templatePath = path.join(process.cwd(), "public", "attendees.ejs");
  const template = await fs.readFile(templatePath, "utf-8");
  const html = ejs.render(template, templateData);

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-software-rasterizer",
      "--headless=new",
    ],
    headless: true,
    protocolTimeout: 120000,
  });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({
    format: "a4",
    printBackground: true,
  });

  await browser.close();
  const directory = path.join(process.cwd(), "uploads");
  await fs.mkdir(directory, { recursive: true });
  const file_path = path.join(directory, `${event.data?.title}_attendees.pdf`);
  await fs.writeFile(file_path, pdf);

  const upload_params = {
    Bucket: env_vars.BUCKET,
    Key: path.basename(file_path),
    Body: pdf,
    ACL: "public-read",
    ContentType: "application/pdf",
  };

  try {
    await files.s3.upload(upload_params).promise();
    const public_url = files.get_public_url(upload_params.Key);
    return createResponse(
      true,
      "Here is your link to download the pdf",
      public_url,
    );
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return createResponse(false, "Could not upload file", null);
  }
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
  fetch_advertisement_banners,
};
