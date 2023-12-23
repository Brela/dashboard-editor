import prisma from "../config/prismaClient.js";
import argon2 from "argon2";
import { createMockProducts } from "../utils/createMockProducts.js";
import { createManyInventoryItemsInternally } from "../controllers/inventory.js";
import { generateAccessToken, generateRefreshToken } from "./authentication.js";

export const getUsers = async (req, res) => {
  let users;
  try {
    users = await prisma.User.findMany({
      /*     include: {
      
      }, */
    });
  } catch (error) {
    console.log("Error Found: ", error);
    return res.json(error);
  }
  return res.json(users);
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  let user;
  try {
    const userData = await prisma.User.findUnique({
      where: {
        id: id,
      },
    });
    user = userData;
  } catch (err) {
    console.log("Error Found: ", err);
    return res
      .status(500)
      .json({ message: "Failed to create user", error: err });
  }
  if (user) {
    return res.json(user);
  } else {
    return res.json({
      message: `There are no users with the ID ${id}`,
    });
  }
};

export const createUser = async (req, res) => {
  res.header("Access-Control-Allow-Origin", `${process.env.CORS_ORIGIN}`);
  const { username, password } = req.body;
  const hashedPassword = await argon2.hash(password);
  console.log(username, hashedPassword);
  let user;
  try {
    const createUser = await prisma.User.create({
      data: {
        username: username,
        password: hashedPassword,
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
    .cookie("accessToken", accessToken, { httpOnly: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true })
    .json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.User.delete({
      where: {
        id: id,
      },
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.json({ message: "User not found" });
    } else {
      console.log("Error Found: ", err);
      return res.json(err);
    }
  }
  return res.json({ message: "User deleted!" });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userInput = req.body;
  let user;
  try {
    const updatedUser = await prisma.User.update({
      where: {
        id: id,
      },
      data: {
        ...userInput,
      },
    });
    user = updatedUser;
  } catch (err) {
    if (err.code === "P2025") {
      return res.json({ message: "User not found" });
    } else {
      console.log("Error Found: ", err);
      return res.json(err);
    }
  }
  return res.json(user);
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
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};
