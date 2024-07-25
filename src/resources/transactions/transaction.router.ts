import { Router } from "express";
import transaction_controller from "./transaction.controller.js";
import auth from "../../middleware/auth.js";

const transaction_router = Router();

transaction_router.post(
  "/",
  auth.authenticate,
  transaction_controller.fetch_transactions,
);

export default transaction_router;
