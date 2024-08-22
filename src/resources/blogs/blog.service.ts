import { IBlog, IJwtPayload } from "../../../interfaces/index.js";
import { get_current_date_time } from "../../utils/date_time.js";
import Blogs from "../../database/models/blogs.js";
import createResponse from "../../utils/response_envelope.js";
import { send_email } from "../../utils/email.js";
import { Schema } from "mongoose";

const create_blog = async (email: string, name: string, data: IBlog) => {
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
  return createResponse(true, "Blog saved to draft successfully", blog);
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
      created_at: 1,
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
  if (!blogs) {
    return createResponse(
      false,
      "No blogs published yet, check back later",
      null,
    );
  }
  return createResponse(true, "Blogs fetched successfully", blogs);
};
const change_blog_status = async (blog_id: string) => {
  const blog = await Blogs.findOne({ _id: blog_id }).populate(
    "author",
    "email name",
  );
  if (!blog) {
    return createResponse(false, "Blog not found", null);
  }
  blog.active ? (blog.active = false) : (blog.active = true);
  await blog.save();
  const message = `Your blog ${blog.name} has been published successfully`;
  const subject = "Blog Published";
  //@ts-ignore
  await send_email(blog.author.email, subject, message, blog.author.name);
  const status = blog.active ? "published" : "saved to draft";
  return createResponse(true, `Blog ${status} successfully`, blog);
};
const blogs_stats = async () => {
  const blogs = await Blogs.find();
  if (blogs.length < 1) {
    return createResponse(false, "No blogs found", null);
  }
  const total_blogs = blogs.length;
  const total_published = blogs.filter((blog: IBlog) => blog.active).length;
  const total_drafts = total_blogs - total_published;
  return createResponse(true, "Blogs stats fetched successfully", {
    total_blogs,
    total_published,
    total_drafts,
  });
};
export default {
  create_blog,
  fetch_blogs,
  fetch_blogs_users,
  change_blog_status,
  blogs_stats,
};
