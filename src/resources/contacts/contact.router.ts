import { Router } from "express";
import contact_controller from "./contact.controller.js";

const contact_router = Router();

contact_router
  .route("/")
  .post(contact_controller.create_contact)
  .get(contact_controller.fetch_contact);

export default contact_router;
