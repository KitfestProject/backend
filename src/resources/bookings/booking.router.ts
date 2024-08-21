import { Router } from "express";
import booking_controller from "./booking.controller.js";
import auth from "../../middleware/auth.js";

const booking_router = Router();

booking_router.post("/", auth.authenticate, booking_controller.book_ticket);
booking_router.get("/verify/:id", booking_controller.verify_qr_code);

export default booking_router;
