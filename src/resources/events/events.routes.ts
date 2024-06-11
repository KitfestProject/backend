import { Router } from "express";
import files from "../../utils/file_upload.js";
import event_controller from "./event.controller.js";

const events_routes = Router();

events_routes.post(
  "/files",
  files.upload.single("cover"),
  event_controller.file_upload,
);

export default events_routes;
