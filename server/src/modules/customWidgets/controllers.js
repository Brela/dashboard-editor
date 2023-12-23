import {
  getAllCustomWidgetsQuery,
  getAllCustomWidgetsCountQuery,
  createCustomWidgetQuery,
  updateCustomWidgetQuery,
  deleteCustomWidgetQuery,
  getOneCustomWidgetQuery,
} from "./repository.js";

import {
  customWidgetOrderSchema,
  customWidgetCreateSchema,
  customWidgetUpdateSchema,
} from "./validators.js";

import {
  parseQueryParams,
  generateMeta,
  extractStackTraceInfo,
  generateSearchQueries,
} from "../../utils/index.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllCustomWidgets = async (req, res) => {
  const companyId = req?.companyId;

  const { page, size, offset, orderBy, search } = parseQueryParams(req);

  const { error } = customWidgetOrderSchema.validate(orderBy, {
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

  const searchQueries = generateSearchQueries(search, ["name"]);

  try {
    const { items, total_filtered } = await prisma.$transaction(async (tx) => {
      const items = await getAllCustomWidgetsQuery(
        {
          where: {
            companyId: companyId,
            OR: searchQueries,
          },
          orderBy,
          skip: offset,
          take: size,
        },
        tx,
      );

      const total_filtered = await getAllCustomWidgetsCountQuery(
        {
          where: {
            companyId: companyId,
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
    console.error("Error retrieving custom widgets:", error);
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

const getOneCustomWidget = async (req, res) => {
  try {
    const customWidget = await getOneCustomWidgetQuery({
      where: {
        id: req.params.id,
        companyId: req.companyId,
      },
    });

    if (customWidget) {
      return res.status(200).json(customWidget);
    } else {
      return res.status(404).json({
        location: extractStackTraceInfo(new Error()),
        message: "The requested resource could not be found.",
      });
    }
  } catch (error) {
    console.error("Error retrieving custom widget:", error);
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

const createCustomWidget = async (req, res) => {
  const payload = req.body;

  const { error } = customWidgetCreateSchema.validate(payload, {
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
    // Check if a custom widget with the same name already exists
    const existingWidget = await prisma.customWidget.findFirst({
      where: {
        name: payload.name,
        companyId: req?.companyId,
      },
    });

    if (existingWidget) {
      return res.status(400).json({
        message: "A custom widget with this name already exists.",
      });
    }

    const newCustomWidget = await createCustomWidgetQuery({
      data: {
        ...payload,
        userId: req?.user?.id,
        companyId: req?.companyId,
      },
    });
    return res.status(200).json(newCustomWidget);
  } catch (error) {
    console.error("Error creating custom widget:", error);
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

const updateCustomWidget = async (req, res) => {
  const id = Number(req.params.id);
  const payload = req.body;

  const { error } = customWidgetUpdateSchema.validate(payload, {
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
    const updated = await updateCustomWidgetQuery({
      where: {
        id: id,
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
    console.error("Error updating custom widget:", error);
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

const deleteCustomWidget = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deletedCustomWidget = await deleteCustomWidgetQuery({
      where: { id: id },
    });

    if (!deletedCustomWidget) {
      return res.status(404).json({
        location: extractStackTraceInfo(new Error()),
        message: "The requested resource could not be found.",
      });
    }

    return res.status(200).json({
      message: `Custom widget with ID ${id} successfully deleted.`,
    });
  } catch (error) {
    console.error("Error deleting custom widget:", error);
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

export {
  getAllCustomWidgets,
  createCustomWidget,
  updateCustomWidget,
  deleteCustomWidget,
  getOneCustomWidget,
};
