import { Router } from "express";
import files from "../../utils/file_upload.js";
import event_controller from "./event.controller.js";
import auth from "../../middleware/auth.js";

const events_routes = Router();

events_routes
  .route("/")
  .post(auth.authenticate, event_controller.create_event)
  .get(event_controller.fetch_events);
events_routes
  .route("/:id")
  .get(event_controller.fetch_one_event)
  .patch(auth.authenticate, event_controller.update_event)
  .delete(auth.authenticate, event_controller.delete_event)
  .put(auth.authenticate, event_controller.change_event_status);
events_routes.post(
  "/admin_fetch",
  auth.authenticate,
  event_controller.fetch_events_admin,
);

export default events_routes;
