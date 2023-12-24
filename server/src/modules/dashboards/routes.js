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

// dashboard routes
router.get("/", getAllDashboards);
router.post("/", createDashboard);
router.patch("/:dashboardId", dashboardIdProvided, updateDashboard);
router.delete("/:dashboardId", dashboardIdProvided, deleteDashboard);
router.get("/:dashboardId", dashboardIdProvided, getOneDashboard);

// widgets routes
router.get("/:dashboardId/widgets", dashboardIdProvided, getWidgetsByDashboard);
router.patch("/:dashboardId/widgets", dashboardIdProvided, updateManyWidgets);

export default router;
