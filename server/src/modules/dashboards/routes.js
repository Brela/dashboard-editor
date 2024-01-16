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
import { authenticateJWT } from "../auth/authenticateJWT.js";
import { addUserToReq } from "../auth/addUserToReq.js";
import { validateSession } from "../../middleware/validateSession.js";

// authenticate all routes except for get dashboards and get widgets
// dashboard routes
router.get("/demo", getDemoDashboards);
router.get("/", validateSession, getAllDashboards);
router.post("/", validateSession, createDashboard);
router.patch(
  "/:dashboardId",
  validateSession,
  dashboardIdProvided,
  updateDashboard,
);
router.delete(
  "/:dashboardId",
  validateSession,
  dashboardIdProvided,
  deleteDashboard,
);
router.get("/:dashboardId", dashboardIdProvided, getOneDashboard);

// widgets routes
router.get("/:dashboardId/widgets", dashboardIdProvided, getWidgetsByDashboard);
router.patch(
  "/:dashboardId/widgets",
  validateSession,
  dashboardIdProvided,
  updateManyWidgets,
);

export default router;
