import express from "express";
const router = express.Router({ mergeParams: true });

import {
  getAllDashboards,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  getOneDashboard,
} from "./dashboards/controllers";

import {
  getWidgetsByDashboard,
  updateManyWidgets,
} from "./widgets/controllers";

import { companyIdProvided } from "../middleware/company";
import { dashboardIdProvided } from "./middleware";

// dashboard routes
router.get("/", companyIdProvided, getAllDashboards);
router.post("/", companyIdProvided, createDashboard);
router.patch("/:dashboardId", dashboardIdProvided, updateDashboard);
router.delete("/:dashboardId", dashboardIdProvided, deleteDashboard);
router.get(
  "/:dashboardId",
  companyIdProvided,
  dashboardIdProvided,
  getOneDashboard,
);

// widgets routes
router.get(
  "/:dashboardId/widgets",
  companyIdProvided,
  dashboardIdProvided,
  getWidgetsByDashboard,
);
router.patch(
  "/:dashboardId/widgets",
  companyIdProvided,
  dashboardIdProvided,
  updateManyWidgets,
);

export default router;
