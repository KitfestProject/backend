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
user_routes.patch("/:id", auth.authenticate, user_controller.update_user);
user_routes.get(
  "/dashboard",
  auth.authenticate,
  user_controller.user_dashboard,
);
user_routes.patch(
  "/my_password",
  auth.authenticate,
  user_controller.update_password,
);
user_routes.get(
  "/my_tickets",
  auth.authenticate,
  user_controller.fetch_my_tickets,
);

export default user_routes;
