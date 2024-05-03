import { Router } from "express";
import user_routes from "../resources/users/user.route.js";

const api = Router();

api.use("/users", user_routes);

export default api;
