import express from "express";
const router = express.Router({ mergeParams: true });

import {
  getDemoDashboards,
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
import { authenticateJWT } from "../../middleware/authenticateJWT.js";

// authenticate all routes except for get dashboards and get widgets
// dashboard routes
router.get("/demo", getDemoDashboards);
router.get("/", authenticateJWT, getAllDashboards);
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
