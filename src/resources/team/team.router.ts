import { Router } from "express";
import team_controller from "./team.controller.js";
import auth from "../../middleware/auth.js";

const team_router = Router();

team_router
  .route("/")
  .post(
    auth.authenticate,
    auth.authorize_admin,
    team_controller.create_team_member,
  )
  .get(team_controller.fetch_team_members);
team_router.post(
  "/admin",
  auth.authenticate,
  auth.authorize_admin,
  team_controller.fetch_team_members_admin,
);
team_router
  .route("/:id")
  .get(team_controller.fetch_team_member)
  .patch(
    auth.authenticate,
    auth.authorize_admin,
    team_controller.update_team_member,
  )
  .delete(
    auth.authenticate,
    auth.authorize_admin,
    team_controller.delete_team_member,
  );

export default team_router;
