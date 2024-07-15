import { Router } from "express";
import venue_controller from "./venue.controller.js";
import auth from "../../middleware/auth.js";

const venue_routes = Router();

venue_routes.post("/", auth.authenticate, venue_controller.create_venue);
venue_routes.post(
  "/section",
  auth.authenticate,
  venue_controller.add_venue_section,
);
venue_routes.get("/", venue_controller.get_venues);
venue_routes
  .route("/:id")
  .get(venue_controller.get_venue)
  .delete(venue_controller.remove_venue);

export default venue_routes;
