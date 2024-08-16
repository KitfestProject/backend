import { IBlog, IJwtPayload } from "../../../interfaces/index.js";
import { get_current_date_time } from "../../utils/date_time.js";
import Blogs from "../../database/models/blogs.js";
import createResponse from "../../utils/response_envelope.js";
import { send_email } from "../../utils/email.js";
import { Schema } from "mongoose";

const create_blog = async (email: string, name: string, data: IBlog) => {
  /*
  Notification should be sent to the autor of the blog
  if active is true else return saved to draft
  */
  const created_at = get_current_date_time();

  data.created_at = created_at;
  data.updated_at = created_at;

  const blog = await Blogs.create(data);

  if (!blog) {
    return createResponse(
      false,
      "Could not create blog, try again later",
      null,
    );
  }
  if (!data.active) {
    return createResponse(true, "Blog saved to draft successfully", blog);
  }
  const message = `Your blog ${data.name} has been published successfully`;
  const subject = "Blog Published";
  await send_email(email, subject, message, name);
  return createResponse(true, "Blog created, and published successfully", blog);
};
const fetch_blogs = async (length: number, search: string, start: number) => {
  const total_records = await Blogs.countDocuments();
  const blogs = await Blogs.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  })
    .skip(start)
    .limit(length)
    .populate("author", "name")
    .populate("category", "name")
    .select("_id cover_image name active category created_at")
    .sort({
      created_at: -1,
    });
  if (!blogs) {
    return createResponse(
      false,
      "Could not fetch blogs, try again later",
      null,
    );
  }
  const transformed_blogs = blogs.map((blog: any) => ({
    id: blog._id,
    name: blog.name,
    author_name: blog.author.name,
    category: blog.category ? blog.category.name : "General",
    cover_image: blog.cover_image,
    active: blog.active,
    created_at: blog.created_at,
  }));
  return createResponse(true, "Blogs fetched successfully", {
    blogs: transformed_blogs,
    total_records,
  });
};
const fetch_blogs_users = async (length: number, start: number) => {
  const blogs = await Blogs.find({ active: true })
    .populate("author", "name")
    .skip(start)
    .limit(length);
  if (blogs.length < 1) {
    return createResponse(
      false,
      "No blogs published yet, check back later",
      null,
    );
  }
  return createResponse(true, "Blogs fetched successfully", blogs);
};
export default { create_blog, fetch_blogs, fetch_blogs_users };
