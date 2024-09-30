import { Router } from "express";
import booking_controller from "./booking.controller.js";

const booking_router = Router();

booking_router.post("/", booking_controller.book_ticket);
booking_router.get("/verify/:id", booking_controller.verify_qr_code);

export default booking_router;
