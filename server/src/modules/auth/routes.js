import express from "express";
const router = express.Router();

import * as authenticationController from "./controllers.js";
import { authenticateJWT } from "./authenticateJWT.js";

router.post("/login", authenticationController.loginUser);
router.post("/logout", authenticationController.logoutUser);

router.get("/authenticateUser", authenticateJWT, (req, res) => {
  // If JWT is valid, user data will be attached to req.user
  res.json(req.user);
});

export default router;
