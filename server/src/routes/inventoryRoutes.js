import express from "express";
import * as inventoryController from "../controllers/inventory.js";
import { authenticateJWT } from "../middleware/jwtAuth.js";
import prisma from "../config/prismaClient.js";

const router = express.Router();

/* function logReqUser(req, res, next) {
  console.log("req.user -----1-1-1-1-1-1-1:", req.user);
  next();
} */


router.get('/stats/:userId', inventoryController.getInventoryStats);


router.get("/", authenticateJWT, inventoryController.getInventoryList);
// router.get('/:id', inventoryController.getInventoryItem);

router.post("/", authenticateJWT, inventoryController.createInventoryItem);
router.post(
  "/upload",
  authenticateJWT,
  inventoryController.convertCsvFileToJson
);
router.post(
  "/bulk",
  authenticateJWT,
  inventoryController.createManyInventoryItems
);

// we can use PATCH to replace some values or use PUT to replace whole item
router.patch("/:id", authenticateJWT, inventoryController.updateInventoryItem);

router.delete(
  "/bulk",
  authenticateJWT,
  inventoryController.deleteInventoryItems
);

export default router;
