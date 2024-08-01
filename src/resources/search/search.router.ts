import { Router } from "express";
import search_controller from "./search.controller.js";

const search_router = Router();

search_router.post("/", search_controller.serch_events_and_artists);

export default search_router;
