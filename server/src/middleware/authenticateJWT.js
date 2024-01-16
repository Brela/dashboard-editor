import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/envConfig.js";

// figure out why frontend shows just 401 without message
export const authenticateJWT = (req, res, next) => {
  try {
    // for testing - remove this
    // return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Invalid Token" });
    // console.log("accessToken:", accessToken);

    let accessToken = req.cookies.accessToken;
    // console.log("accessToken:", accessToken);
    // Check Authorization header if the token is not in cookies
    if (!accessToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
      }
    }

    // If no token is found in both cookies and Authorization header
    if (!accessToken) {
      return res.status(401).json({
        message: "No access token found",
      });
    }
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
      console.log("err:", err);
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Token expired",
            expiredAt: err.expiredAt,
          });
        } else {
          return res.status(403).json({ message: "Invalid Token" });
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
      .status(500)

      .json({ message: "Internal Server Error" });
  }
};
