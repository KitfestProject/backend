import { Router } from "express";
import files from "../../utils/file_upload.js";
import file_controller from "./file.controller.js";

const file_router = Router();

file_router.post("/", files.upload.single("file"), file_controller.file_upload);

export default file_router;
