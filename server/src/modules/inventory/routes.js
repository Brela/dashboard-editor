import express from "express";
import * as inventoryController from "./controllers.js";

import prisma from "../../config/prismaClient.js";

const router = express.Router();

/* function logReqUser(req, res, next) {
  console.log("req.user -----1-1-1-1-1-1-1:", req.user);
  next();
} */

router.get("/stats/:userId", inventoryController.getInventoryStats);

router.get("/", inventoryController.getInventoryList);
// router.get('/:id', inventoryController.getInventoryItem);

router.post("/", inventoryController.createInventoryItem);
router.post(
  "/upload",

  inventoryController.convertCsvFileToJson,
);
router.post(
  "/bulk",

  inventoryController.createManyInventoryItems,
);

// we can use PATCH to replace some values or use PUT to replace whole item
router.patch("/:id", inventoryController.updateInventoryItem);

router.delete(
  "/bulk",

  inventoryController.deleteInventoryItems,
);

export default router;
