import express from "express";
const router = express.Router();
import { authenticateJWT } from "../../middleware/authenticateJWT.js";

router.get("/authenticateUser", authenticateJWT, (req, res) => {
  // If JWT is valid, user data will be attached to req.user
  res.json(req.user);
});

export default router;
