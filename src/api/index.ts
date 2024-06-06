import { Router } from "express";
import user_routes from "../resources/users/user.route.js";
import category_routes from "../resources/categories/category.route.js";
import venue_routes from "../resources/venues/venue.route.js";
import preference_router from "../resources/preferences/prefernce.route.js";

const api = Router();

api.use("/users", user_routes);
api.use("/categories", category_routes);
api.use("/venues", venue_routes);
api.use("/preference", preference_router);

export default api;
