import prisma from "../../config/prismaClient.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  IS_DEV_MODE,
} from "../../config/envConfig.js";

const HTTP_STATUS = {
  // changed from 202 to 200
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};

const isDevMode = process.env.IS_DEV_MODE === "true";

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

const allowedOrigins = process.env.CORS_ORIGINS.split(",");

export const registerUser = async (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  const { username, password, isTempAccount } = req.body;
  const hashedPassword = await argon2.hash(password);
  console.log(username, hashedPassword);
  let user;

  try {
    const registerUser = await prisma.User.create({
      data: {
        username: username,
        password: hashedPassword,
        isTempAccount: isTempAccount,
      },
    });
    user = registerUser;
  } catch (err) {
    console.log("Error Found: ", err);
    return res.json(err);
  }
  console.log(user.username);

  // Generate tokens for automatic login after sign up
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return res
    .status(202)
    .cookie("accessToken", accessToken, {
      // adding these args to the create user was the fix for mobile???
      httpOnly: true,
      secure: !isDevMode,
      sameSite: isDevMode ? "Lax" : "None",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !isDevMode,
      sameSite: isDevMode ? "Lax" : "None",
    })
    .json(user);
};

export const getLoggedInUser = async (req, res) => {
  try {
    const userData = await prisma.User.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(userData);
  } catch (err) {
    console.log("Error Found: ", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

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
        secure: !isDevMode,
        sameSite: isDevMode ? "Lax" : "None",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: !isDevMode,
        sameSite: isDevMode ? "Lax" : "None",
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
