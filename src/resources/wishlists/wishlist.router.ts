import { Router } from "express";
import auth from "../../middleware/auth.js";
import wishlist_controller from "./wishlist.controller.js";

const wishlist_router = Router();

wishlist_router
  .route("/")
  .post(auth.authenticate, wishlist_controller.create_wishlist)
  .get(auth.authenticate, wishlist_controller.fetch_wishlist);

wishlist_router
  .route("/:id")
  .delete(auth.authenticate, wishlist_controller.delete_wishlist);

export default wishlist_router;
