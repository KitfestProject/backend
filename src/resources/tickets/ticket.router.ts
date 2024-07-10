import { Router } from "express";
import ticket_controller from "./ticket.controller.js";
import auth from "../../middleware/auth.js";

const ticket_router = Router();

ticket_router.get("/", auth.authenticate, ticket_controller.fetch_tickets);

export default ticket_router;
