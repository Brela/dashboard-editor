import prisma from "../../config/prismaClient.js";
import argon2 from "argon2";
import { createMockProducts } from "../../utils/createMockProducts.js";
import { createManyInventoryItemsInternally } from "../inventory/controllers.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth/controllers.js";

const isDevMode = process.env.IS_DEV_MODE === "true";

const allowedOrigins = process.env.CORS_ORIGINS.split(",");

export const createUser = async (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  const { username, password, isTempAccount } = req.body;
  const hashedPassword = await argon2.hash(password);
  console.log(username, hashedPassword);
  let user;

  try {
    const createUser = await prisma.User.create({
      data: {
        username: username,
        password: hashedPassword,
        isTempAccount: isTempAccount,
      },
    });
    user = createUser;
  } catch (err) {
    console.log("Error Found: ", err);
    return res.json(err);
  }
  console.log(user.username);

  try {
    const mockProducts = createMockProducts(user?.id);
    await createManyInventoryItemsInternally(mockProducts, user);
  } catch (err) {
    console.log("Error Found while creating inventory items: ", err);
    return res.json(err);
  }

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
