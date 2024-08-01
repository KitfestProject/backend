import { Router } from "express";
import seatmap_controller from "./seatmap.controller.js";

const seatmap_router = Router();

seatmap_router
  .post("/", seatmap_controller.create_seatmap_section)
  .get("/", seatmap_controller.fetch_seatmap_section);

seatmap_router
  .route("/:id")
  .get(seatmap_controller.fetch_section)
  .patch(seatmap_controller.update_seatmap_section)
  .delete(seatmap_controller.delete_seatmap_section);
seatmap_router.patch(
  "/:id/seats",
  seatmap_controller.update_seatmap_section_seat,
);
export default seatmap_router;
