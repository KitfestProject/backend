import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import collection from "../../utils/collection.js";
import events_service from "./event.service.js";
import { IEventQuery, IEvents } from "../../../interfaces/index.js";
import crud from "../../utils/crud.js";
import Events from "../../database/models/events.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const create_event = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { id } = req.user;
    data.organizer = id;
    //Front end sends data in camelCase, convert to snake_case since all our schemas are in snake_case
    const convert_schema_keys = collection.convert_keys(data) as IEvents;
    const response = await events_service.create_event(convert_schema_keys);
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const fetch_events = async (req: Request, res: Response) => {
  try {
    for (let key in req.query) {
      if (req.query[key] === null || req.query[key] === "null") {
        req.query[key] = undefined;
      }
    }
    const { date, location, limit, paid, featured, start } = req.query;
    const query = {
      date: date as string,
      location: location as string,
      limit: parseInt(limit as string) as number,
      start: parseInt(start as string) as number,
      paid: paid as string,
      featured: Boolean(featured as string) as boolean,
    } as IEventQuery;
    const response = await events_service.fetch_events(query);
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const fetch_one_event = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await events_service.fetch_one_event(id);
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

const fetch_events_admin = async (req: Request, res: Response) => {
  try {
    const { id, is_admin } = req.user;
    const { length, start, draw, search } = req.body;

    const response = await events_service.fetch_events_admin(
      id,
      is_admin,
      start,
      length,
      search.value,
    );

    return res.status(200).json({
      draw,
      recordsTotal: response.data?.total_records,
      recordsFiltered: response.data?.total_records,
      data: response.data?.events,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const change_event_status = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const response = await events_service.change_event_status(id, status);
    return res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};
const download_event_attendees_pdf = async (req: Request, res: Response) => {
  const event_id = req.params.id;
  const event = await events_service.fetch_one_event(event_id);
  if (!event.success) {
    return res.status(404).json({ message: "Event not found" });
  }
  const event_attendees = event.data?.attendees!;
  const __dirname = path.resolve() + "/uploads";
  const file_path = path.join(__dirname, `${event.data?.title}_attendees.pdf`);
  const write_stream = fs.createWriteStream(file_path);
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
  doc
    .fontSize(18)
    .text("Firstname", 50, 180)
    .text("Lastname", 200, 180)
    .text("Email", 350, 180)
    .text("Phone", 550, 180)
    .text("TicketType", 690, 180);
  doc.moveTo(50, 200).lineTo(800, 200).stroke();

  let currentY = 210;
  const sorted_attendees = event_attendees.sort((a: any, b: any) =>
    a.first_name.localeCompare(b.first_name),
  );
  sorted_attendees.forEach((attendee: any, index: number) => {
    if (index % 2 === 0) {
      doc
        .rect(50, currentY - 5, 750, 20)
        .fill("#e0e0e0")
        .fillColor("#000");
    } else {
      doc
        .rect(50, currentY - 5, 750, 20)
        .fill("#c18a73")
        .fillColor("#000");
    }
    doc
      .fontSize(12)
      .text(attendee.first_name, 50, currentY)
      .text(attendee.last_name, 200, currentY)
      .text(attendee.email, 350, currentY, { width: 200, ellipsis: true })
      .text(attendee.phone_number, 550, currentY)
      .text(attendee.ticket_type, 700, currentY);
    currentY += 20;
  });
  doc.end();
  // Wait for the file to finish writing and then send the download link
  write_stream.on("finish", () => {
    res.download(file_path, "event_attendees.pdf", (err) => {
      if (err) {
        console.error("Error during file download:", err);
        res.status(500).json({ message: "Error downloading file" });
      } else {
        fs.unlink(file_path, (err) => {
          if (err) console.error("Failed to delete temporary file:", err);
        });
      }
    });
  });
};
const update_event = crud.updateOne(Events);

const delete_event = crud.deleteOne(Events);
export default {
  create_event,
  fetch_events,
  fetch_one_event,
  delete_event,
  fetch_events_admin,
  update_event,
  change_event_status,
  download_event_attendees_pdf,
};
