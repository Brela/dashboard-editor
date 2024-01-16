import {
  getAllDashboardQuery,
  getAllDashboardCountQuery,
  createDashboardQuery,
  updateDashboardQuery,
  deleteDashboardQuery,
  getOneDashboardQuery,
} from "./repository.js";

import { deleteManyDashboardWidgetsQuery } from "../widgets/repositoryLive.js";

import {
  dashboardOrderSchema,
  dashboardCreateSchema,
  dashboardUpdateSchema,
} from "./validators.js";

import {
  parseQueryParams,
  generateMeta,
  extractStackTraceInfo,
  generateSearchQueries,
} from "../../../utils/index.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getDemoDashboards = async (req, res) => {
  // used for demo to view dashboards and widgets
  // this is the userId for xrp777
  const userId = process.env.DEMO_USER_ID;
  try {
    const items = await prisma.dashboard.findMany({
      where: {
        userId: userId,
      },
    });

    return res.status(200).json({
      items: items,
    });
  } catch (error) {
    console.error("Error retrieving items:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const getAllDashboards = async (req, res) => {
  let userId = req?.user?.id;
  const { page, size, orderBy, search } = parseQueryParams(req);

  const { error } = dashboardOrderSchema.validate(orderBy, {
    abortEarly: false,
  });

  if (error) {
    const fields = error.details.map((detail) => ({
      field: detail.context.key,
      message: String(detail.message.replace(/_/g, " ")).replace(/["\\]/g, ""),
    }));

    return res.status(422).json({
      //422: Unprocessable Entity good for validation errors
      type: "validation_error",
      location: extractStackTraceInfo(new Error()),
      time_stamp: new Date(),
      fields: fields,
    });
  }

  const searchQueries = generateSearchQueries(search, ["name"]);

  try {
    orderBy.unshift({ isDefault: "desc" });
    const { items, total_filtered } = await prisma.$transaction(async (tx) => {
      const items = await getAllDashboardQuery(
        {
          where: {
            userId: userId,
            OR: searchQueries,
          },
          orderBy,
        },
        tx,
      );

      // Use Prisma to get the total count of matching records
      const total_filtered = await getAllDashboardCountQuery(
        {
          where: {
            userId: userId,

            OR: searchQueries,
          },
        },
        tx,
      );

      return { items, total_filtered };
    });

    return res.status(200).json({
      meta: generateMeta(
        total_filtered,
        page,
        size,
        items.length,
        orderBy,
        search,
      ),
      items: items,
    });
  } catch (error) {
    console.error("Error retrieving items:", error);
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

const getOneDashboard = async (req, res) => {
  try {
    const part = await getOneDashboardQuery({
      where: {
        id: req?.dashboardId,
      },
    });

    if (part) {
      return res.status(200).json(part);
    } else {
      return res.status(404).json({
        location: extractStackTraceInfo(new Error()),
        message: "The requested resource could not be found.",
      });
    }
  } catch (error) {
    console.error("Error retrieving item:", error);
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

const createDashboard = async (req, res) => {
  let userId = req?.user?.id;
  const payload = req.body;

  const { error } = dashboardCreateSchema.validate(payload, {
    abortEarly: false,
  });

  if (error) {
    const fields = error.details.map((detail) => ({
      field: detail.context.key,
      message: String(detail.message.replace(/_/g, " ")).replace(/["\\]/g, ""),
    }));

    return res.status(422).json({
      type: "validation_error",
      location: extractStackTraceInfo(new Error()),
      time_stamp: new Date(),
      fields: fields,
    });
  }

  try {
    // Check if a dashboard with the same name already exists
    const existingDashboard = await prisma.dashboard.findFirst({
      where: {
        name: payload.name,
        userId: userId,
      },
    });

    if (existingDashboard) {
      return res.status(400).json({
        message: "A dashboard with this name already exists.",
      });
    }

    const newDashboard = await createDashboardQuery({
      data: {
        ...payload,
        userId: req?.user?.id,
      },
    });
    return res.status(201).json(newDashboard);
  } catch (error) {
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

const updateDashboard = async (req, res) => {
  const dashboardId = req.dashboardId;
  const payload = req.body;

  const { error } = dashboardUpdateSchema.validate(payload, {
    abortEarly: false,
  });

  if (error) {
    const fields = error.details.map((detail) => ({
      field: detail.context.key,
      message: String(detail.message.replace(/_/g, " ")).replace(/["\\]/g, ""),
    }));

    return res.status(422).json({
      //422: Unprocessable Entity good for validation errors
      type: "validation_error",
      location: extractStackTraceInfo(new Error()),
      time_stamp: new Date(),
      fields: fields,
    });
  }

  try {
    const updated = await updateDashboardQuery({
      where: {
        id: dashboardId,
      },
      data: {
        ...payload,
        updatedAt: new Date(),
      },
    });

    if (!updated) {
      return res.status(404).json({
        location: extractStackTraceInfo(new Error()),
        message: "The requested resource could not be found.",
      });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

const deleteDashboard = async (req, res) => {
  try {
    const dashboardId = req?.dashboardId;

    await prisma.$transaction(async (tx) => {
      // Delete all widgets associated with the dashboard
      await deleteManyDashboardWidgetsQuery(
        { where: { dashboardId: dashboardId } },
        tx,
      );

      // Then, delete the dashboard
      await deleteDashboardQuery({ where: { id: dashboardId } }, tx);
    });

    return res.status(200).json({
      message: `Dashboard with ID ${dashboardId} successfully deleted.`,
    });
  } catch (error) {
    console.error("Error deleting dashboard:", error);
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

export {
  getDemoDashboards,
  getAllDashboards,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  getOneDashboard,
};
