import prisma from "../../config/prismaClient.js";
import argon2 from "argon2";
import { createMockProducts } from "../../utils/createMockProducts.js";
import { createManyInventoryItemsInternally } from "../inventory/controllers.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth/controllers.js";

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
      secure: true,
      sameSite: "Lax",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    })
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
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export const createSeedDataForUser = async (req, res) => {
  let userId = req?.user?.id;
  const seedUserId = process.env.DEMO_USER_ID;

  // Get all dashboards of the seed user
  const seedDashboards = await prisma.dashboard.findMany({
    where: {
      userId: seedUserId,
    },
    include: {
      widgets: true, // Include the widgets of each dashboard
    },
  });

  console.log("seedDashboards: ", seedDashboards);
  // For each dashboard of the seed user
  for (const seedDashboard of seedDashboards) {
    // Destructure the id property out of the seedDashboard object
    const { id, ...dashboardWithoutId } = seedDashboard;

    // Create a new dashboard for the new user
    const newDashboard = await prisma.dashboard.create({
      data: {
        ...dashboardWithoutId,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    console.log("Created dashboard:", newDashboard);

    // For each widget of the seed dashboard
    for (const seedWidget of seedDashboard.widgets) {
      // Destructure the id property out of the seedWidget object
      const { id, ...widgetWithoutId } = seedWidget;

      // Create a new widget for the new dashboard
      const newWidget = await prisma.widget.create({
        data: {
          ...widgetWithoutId,
          dashboard: {
            connect: {
              id: newDashboard.id,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      console.log("Created widget:", newWidget);
    }
  }
  res.json({ message: "Seed data created successfully" });
};
