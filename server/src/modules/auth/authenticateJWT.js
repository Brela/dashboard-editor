import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config/envConfig.js";
import { HTTP_STATUS } from "../../config/constants.js";

// figure out why frontend shows just 401 without message
export const authenticateJWT = (req, res, next) => {
  try {
    // for testing - remove this
    // return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Invalid Token" });
    // console.log("accessToken:", accessToken);

    const accessToken = req.cookies.accessToken;
    console.log("accessToken:", typeof accessToken);
    if (!accessToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "In authenticateJWT - no access token found in cookies ",
      });
    }
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
      console.log("err:", err);
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Token expired",
            expiredAt: err.expiredAt,
          });
        } else {
          return res
            .status(HTTP_STATUS.FORBIDDEN)
            .json({ message: "Invalid Token" });
        }
      }
      req.user = user;
      // iat and expires data/time converted to readable time
      req.user.iatReadable = new Date(user.iat * 1000).toUTCString();
      req.user.expires = new Date(user.exp * 1000).toUTCString();
      console.log("token expires -----1-1-1-1-1-1-1:", req.user.expires);
      next();
    });
  } catch (err) {
    console.log("Error in authenticateJWT:", err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)

      .json({ message: "Internal Server Error" });
  }
};
