import prisma from "../../config/prismaClient.js";
import argon2 from "argon2";

const isDevMode = process.env.IS_DEV_MODE === "true";

const allowedOrigins = process.env.CORS_ORIGINS.split(",");

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
