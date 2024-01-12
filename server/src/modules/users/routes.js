import express from "express";
import * as usersController from "./controllers.js";
import { authenticateJWT } from "../auth/authenticateJWT.js";

const router = express();

router.get("/me", authenticateJWT, usersController.getLoggedInUser);
router.post("/", usersController.createUser);

export default router;
