import express from "express";
const router = express.Router({ mergeParams: true });

import {
  getAllDashboards,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  getOneDashboard,
} from "./dashboards/controllers.js";

import {
  getWidgetsByDashboard,
  updateManyWidgets,
} from "./widgets/controllers.js";

import { dashboardIdProvided } from "./middleware.js";
import { authenticateJWT } from "../auth/jwtAuth.js";

// authenticate all routes except for get dashboards and get widgets
// dashboard routes
router.get("/", getAllDashboards);
router.post("/", authenticateJWT, createDashboard);
router.patch(
  "/:dashboardId",
  authenticateJWT,
  dashboardIdProvided,
  updateDashboard,
);
router.delete(
  "/:dashboardId",
  authenticateJWT,
  dashboardIdProvided,
  deleteDashboard,
);
router.get("/:dashboardId", dashboardIdProvided, getOneDashboard);

// widgets routes
router.get("/:dashboardId/widgets", dashboardIdProvided, getWidgetsByDashboard);
router.patch(
  "/:dashboardId/widgets",
  authenticateJWT,
  dashboardIdProvided,
  updateManyWidgets,
);

export default router;
