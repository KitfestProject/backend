import { Router } from "express";
import user_routes from "../resources/users/user.route.js";
import category_routes from "../resources/categories/category.route.js";

const api = Router();

api.use("/users", user_routes);
api.use("/categories", category_routes);

export default api;
