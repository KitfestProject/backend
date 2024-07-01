import { Request, Response } from "express";
import files from "../../utils/file_upload.js";
import logger from "../../utils/logging.js";

const file_upload = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    // @ts-ignore
    const key = req.file.key;
    const uri = files.get_public_url(key);
    return res
      .status(200)
      .json({ success: true, message: "File uploaded", data: { uri } });
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res.status(500).end();
  }
};

export default { file_upload };
