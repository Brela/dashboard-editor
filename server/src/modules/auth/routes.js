import express from "express";
const router = express.Router();

import * as authenticationController from "./controllers.js";

router.post("/login", authenticationController.loginUser);
router.post("/logout", authenticationController.logoutUser);
router.get("/token", authenticationController.getToken);
router.get("/authenticateUser", authenticationController.authenticateUser);

export default router;
