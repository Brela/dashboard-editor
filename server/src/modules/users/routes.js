import express from "express";
import * as usersController from "./controllers.js";

const router = express();

router.get("/me", usersController.getLoggedInUser);

export default router;
