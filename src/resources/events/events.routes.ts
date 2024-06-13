import { Router } from "express";
import files from "../../utils/file_upload.js";
import event_controller from "./event.controller.js";
import auth from "../../middleware/auth.js";

const events_routes = Router();

events_routes.post(
  "/files",
  files.upload.single("cover"),
  event_controller.file_upload,
);
events_routes
  .route("/")
  .post(auth.authenticate, event_controller.create_event)
  .get(event_controller.fetch_events);
events_routes
  .route("/:id")
  .get(event_controller.fetch_one_event)
  .delete(event_controller.delete_event);

export default events_routes;
