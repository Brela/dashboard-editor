import express from "express";
const router = express.Router({ mergeParams: true });

import {
  getAllCustomWidgets,
  createCustomWidget,
  updateCustomWidget,
  deleteCustomWidget,
  getOneCustomWidget,
} from "./controllers.js";

import { isIDProvided } from "../../middleware/index.js";

// CustomWidgets
router.get("/", getAllCustomWidgets);
router.post("/", createCustomWidget);
router.patch("/:id", isIDProvided, updateCustomWidget);
router.delete("/:id", isIDProvided, deleteCustomWidget);
router.get("/:id", isIDProvided, getOneCustomWidget);

export default router;
