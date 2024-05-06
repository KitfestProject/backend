import { Request, Response, NextFunction } from "express";
import createResponse from "../utils/response_envelope.js";
import logger from "../utils/logging.js";
import { verify_token } from "../utils/jwt.js";
import user_service from "../resources/users/user.service.js";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token;
    const auth_header = req.headers.authorization;
    if (!auth_header) {
      token = req.query.token as string;
    } else {
      token = auth_header.split(" ")[1];
    }
    if (!token) {
      const response = createResponse(false, "Unauthorized", null);
      return res.status(401).json(response);
    }
    const decoded = verify_token(token);
    req.user = decoded;
    const user = await user_service.get_user_by_email(req.user.email);
    if (!user.success) {
      const response = createResponse(false, "Unauthorized", null);
      return res.status(401).json(response);
    }
    next();
  } catch (error) {
    const err = error as Error;
    const response = createResponse(false, "An Error occured try again.", null);
    logger.error(err.message);
    return res.status(500).json(response);
  }
};

export default { authenticate };
