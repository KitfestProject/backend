import { Router } from "express";
import user_controller from "./user.controller.js";
import auth from "../../middleware/auth.js";

const user_routes = Router();

user_routes.post("/sign_up", user_controller.sign_up);
user_routes.post("/sign_in", user_controller.sign_in);
user_routes.get("/verify", auth.authenticate, user_controller.verify_user);

user_routes.post(
  "/",
  auth.authenticate,
  auth.authorize_admin,
  user_controller.fetch_users,
);
user_routes.get("/my_profile", auth.authenticate, user_controller.user_profile);
user_routes.post(
  "/organizer_requests",
  auth.authenticate,
  auth.authorize_admin,
  user_controller.fetch_oganizers_requests,
);
user_routes.patch(
  "/organizer_requests/:id",
  auth.authenticate,
  auth.authorize_admin,
  user_controller.review_organizer_request,
);
user_routes
  .route("/:id")
  .patch(auth.authenticate, user_controller.update_user)
  .get(auth.authenticate, user_controller.fetch_user);
user_routes.get(
  "/dashboard/stats",
  auth.authenticate,
  user_controller.user_dashboard,
);
user_routes.put(
  "/my_password",
  auth.authenticate,
  user_controller.update_password,
);
user_routes.get(
  "/tickets/fetch",
  auth.authenticate,
  user_controller.fetch_my_tickets,
);
user_routes.post(
  "/become_organizer",
  auth.authenticate,
  user_controller.become_organizer,
);

export default user_routes;
