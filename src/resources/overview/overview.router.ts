import { Router } from "express";
import overview_controller from "./overview.controller.js";
import auth from "../../middleware/auth.js";

const overview_router = Router();

overview_router.get("/", auth.authenticate, overview_controller.fetch_stats);

export default overview_router;
