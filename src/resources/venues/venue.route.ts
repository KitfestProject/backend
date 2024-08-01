import { Router } from "express";
import venue_controller from "./venue.controller.js";
import auth from "../../middleware/auth.js";

const venue_routes = Router();

venue_routes.post("/", auth.authenticate, venue_controller.create_venue);
venue_routes.get("/admin", auth.authenticate, venue_controller.fetch_venues);
venue_routes.post(
  "/admin_fetch",
  auth.authenticate,
  auth.authorize_admin,
  venue_controller.fetch_venues_admin,
);
venue_routes.get("/", venue_controller.get_venues);
venue_routes
  .route("/:id")
  .get(venue_controller.get_venue)
  .delete(venue_controller.remove_venue);

export default venue_routes;
