import { Router } from "express";
import blog_controller from "./blog.controller.js";
import auth from "../../middleware/auth.js";

const blog_router = Router();

blog_router.route("/").post(auth.authenticate, blog_controller.create_blog);
blog_router.get("/", blog_controller.fetch_blogs_users);
blog_router.post("/list", blog_controller.fetch_blogs);
blog_router.get("/:id", blog_controller.fetch_blog);
blog_router.patch("/:id", auth.authenticate, blog_controller.update_blog);
blog_router.delete("/:id", auth.authenticate, blog_controller.delete_blog);
blog_router.patch(
  "/:id/change_status",
  auth.authenticate,
  auth.authorize_admin,
  blog_controller.change_blog_status,
);
blog_router.get(
  "/show/stats",
  auth.authenticate,
  // auth.authorize_admin,
  blog_controller.blog_stats,
);

export default blog_router;
