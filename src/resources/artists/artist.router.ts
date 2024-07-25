import { Router } from "express";
import artist_controller from "./artist.controller.js";
import auth from "../../middleware/auth.js";

const artist_router = Router();

artist_router
  .route("/")
  .post(auth.authenticate, artist_controller.create_artist)
  .get(artist_controller.get_artists);

artist_router
  .route("/:id")
  .get(artist_controller.get_artist)
  .patch(auth.authenticate, artist_controller.update_artist)
  .delete(auth.authenticate, artist_controller.delete_artist);
artist_router.post(
  "/admin_fetch",
  auth.authenticate,
  artist_controller.fetch_artists_admin,
);

export default artist_router;
