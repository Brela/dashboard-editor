import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  IS_DEV_MODE,
} from "../../config/envConfig.js";
import { HTTP_STATUS } from "../../config/constants.js";
import { authenticateJWT } from "./authenticateJWT.js";
import prisma from "../../config/prismaClient.js";

const isDevMode = IS_DEV_MODE === "true";

console.log("isDevMode", isDevMode);
async function createToken(data, secret, expiry, type) {
  const token = jwt.sign(data, secret, { expiresIn: expiry });
  await prisma.token.create({
    data: {
      token: token,
      type: type,
      userId: data.id,
    },
  });
  return token;
}

export const generateAccessToken = (user) =>
  createToken(user, ACCESS_TOKEN_SECRET, "1h", "ACCESS");

export const generateRefreshToken = (user) =>
  createToken(user, REFRESH_TOKEN_SECRET, "7d", "REFRESH");

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // latest change User to user
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "That username doesn't exist" });
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Incorrect password" });
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return res
      .status(HTTP_STATUS.OK)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        //  This attribute ensures that the cookie is sent only over HTTPS, which is a good security practice for production. In development, you don't have HTTPS set up, so it's set to false to allow cookies over HTTP.
        // secure: !isDevMode,
        // sameSite: isDevMode ? "Lax" : "None",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: !isDevMode,
        // sameSite: isDevMode ? "Lax" : "None",
      })
      .json({ user, accessToken });
  } catch (err) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED);

  // Clear the cookies
  res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    })
    .json({ message: "Successfully logged out" });
};
