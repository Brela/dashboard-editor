import express from "express";
import * as usersController from "./controllers.js";
import { authenticateJWT } from "../auth/authenticateJWT.js";

const router = express();

router.get("/", authenticateJWT, usersController.getUsers);
router.get("/me", authenticateJWT, usersController.getLoggedInUser);
router.get("/:id", authenticateJWT, usersController.getUser);
router.post("/", usersController.createUser);
router.post("/seeds", usersController.createSeedDataForUser);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

export default router;
