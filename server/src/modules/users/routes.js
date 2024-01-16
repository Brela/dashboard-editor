import express from "express";
import { authenticateJWT } from "../../middleware/authenticateJWT.js";
import {
  loginUser,
  logoutUser,
  getLoggedInUser,
  registerUser,
} from "./controllers.js";

const router = express();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticateJWT, getLoggedInUser);

export default router;
