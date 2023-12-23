import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/envConfig.js";
import { handleError } from "../utils/authUtils.js";
import { HTTP_STATUS } from "../config/constants.js";

export const authenticateJWT = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return handleError(err, res, "Invalid Token");
      req.user = user;
      next();
    });
  } catch (err) {
    return handleError(err, res, "Internal Server Error");
  }
};
