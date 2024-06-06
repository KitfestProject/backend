import { Router } from "express";
import preference_controller from "./preference.controller.js";

//TODO: add auth middleware

const preference_router = Router();

preference_router.post("/", preference_controller.create_preference);
preference_router.get("/", preference_controller.get_preferences);
preference_router.get("/:id", preference_controller.get_preference);
preference_router.patch("/:id", preference_controller.update_preference);
preference_router.delete("/:id", preference_controller.delete_preference);

export default preference_router;
