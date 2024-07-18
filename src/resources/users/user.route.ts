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
user_routes.patch(
  "/:id",
  auth.authenticate,
  auth.authorize_admin,
  user_controller.update_user,
);

export default user_routes;
