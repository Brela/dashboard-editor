import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config/envConfig.js";

export const addUserToReq = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    // If no access token, proceed without adding user to req
    if (!accessToken) {
      return next();
    }

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
        req.user.iatReadable = new Date(user.iat * 1000).toUTCString();
        req.user.expires = new Date(user.exp * 1000).toUTCString();
      }
      // Continue with the request, user is added to req if token is valid
      next();
    });
  } catch (err) {
    // In case of any other server error, continue without user info
    next();
  }
};
