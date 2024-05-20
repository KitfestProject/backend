import { Router } from "express";
import category_controller from "./category.controller.js";
import auth from "../../middleware/auth.js";

const category_routes = Router();

category_routes.use(auth.authenticate, auth.authorize_admin);

category_routes.post("/", category_controller.create_category);
category_routes.get("/", category_controller.get_categories);
category_routes.get("/:id", category_controller.get_category);
category_routes.patch("/:id", category_controller.update_category);
category_routes.delete("/:id", category_controller.delete_category);

export default category_routes;
