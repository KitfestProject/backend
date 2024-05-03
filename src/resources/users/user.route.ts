import { Router } from "express";
import user_controller from "./user.controller.js";

const user_routes = Router();

user_routes.post("/sign_up", user_controller.sign_up);
user_routes.post("/sign_in", user_controller.sign_in);

export default user_routes;
