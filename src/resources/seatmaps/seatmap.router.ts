import { Router } from "express";
import seatmap_controller from "./seatmap.controller.js";

const seatmap_router = Router();

seatmap_router.post("/", seatmap_controller.create_seatmap_section);

export default seatmap_router;
