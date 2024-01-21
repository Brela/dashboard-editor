import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { extractStackTraceInfo, generateMeta } from "../../../utils/index.js";
import {
  getDashboardWidgetsQuery,
  getEachWidgetValue,
  createManyDashboardWidgetsQuery,
  updateDashboardWidgetQuery,
  deleteManyDashboardWidgetsQuery,
} from "./repositoryDemo.js";

import { validateWidgetArraySchema } from "./validators.js";
import { getOneDashboardQuery } from "../dashboards/repository.js";
import { sendNotification } from "../../../rabbitmq/producer.js";

const getWidgetsByDashboard = async (req, res) => {
  const userId = req?.userId;
  const dashboardId = req?.dashboardId;

  // widgets do not need to be ordered or filtered from params

  try {
    // $tansation is a feature that allows group operations with rollback option if error
    const { items } = await prisma.$transaction(async (tx) => {
      const widgets = await getDashboardWidgetsQuery(
        {
          where: {
            userId: userId,
            dashboardId: dashboardId,
          },
        },
        tx,
      );

      const newItems = await getEachWidgetValue(widgets, req);

      return {
        items: widgets.map((widget, index) => ({
          ...widget,
          ...newItems[index],
        })),
      };
    });

    return res.status(200).json({
      meta: generateMeta(items.length),
      items: items,
    });
  } catch (error) {
    console.error("Error retrieving labor rate:", error);
    return res.status(500).json({
      location: extractStackTraceInfo(new Error()),
      message: error.message || "Internal server error",
    });
  }
};

// ------------------------------ Update Many Widgets -------------------------

// this function recieves and array of widgets and handles the creation, deletion, and updates of those widgets
const updateManyWidgets = async (req, res) => {
  const dashboardId = req?.dashboardId;
  let { widgets, widgetUpdates } = req.body;
  widgets = widgets.map(({ error, ...rest }) => rest); // remove widget errors that were sent to frontend from "getWidgetsByDashboard" function

  const userId = req?.user.id;
  const companyId = req?.companyId;

  let allErrors = [];

  // Validate widgets and collect errors
  const addToErrors = (result) => {
    if (result.error) {
      result.error.details.forEach((detail) => {
        let customMessage = detail.message.replace(/[_"]/g, " ");

        // Customize message based on the type of validation error
        if (detail.type === "any.required" && detail.context.key === "entity") {
          customMessage = "Could not find entity";
        } else if (
          detail.type === "any.required" &&
          detail.context.key === "criteria"
        ) {
          customMessage = "Could not find criteria";
        }

        allErrors.push({
          field: detail.context.key,
          message: customMessage,
        });
      });
    }
  };
  // this function returns widgets with errors: for each widget if the value wasn't retrieved, it has a new error property attached to it
  // that error is used on the front end to display the error icon next to value in the widget card
  addToErrors(validateWidgetArraySchema(widgets));

  // Custom Validation
  const existingDashboard = await getOneDashboardQuery({
    where: {
      id: dashboardId,
      userId: userId,
      companyId: companyId,
    },
  });

  if (!existingDashboard) {
    allErrors.push({
      field: "dashboardId",
      message: "Dashboard not found",
    });
  }

  // Check for all errors (Joi validation and custom validation)
  if (allErrors.length > 0) {
    console.log("Errors: ", allErrors);
    return res.status(422).json({
      type: "validation_error",
      location: extractStackTraceInfo(new Error()),
      time_stamp: new Date(),
      errors: allErrors,
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const dbWidgets = await getDashboardWidgetsQuery(
        {
          where: {
            dashboardId: dashboardId,
            userId: userId,
          },
        },
        tx,
      );

      // Filter out widgets to add (new widgets)
      const widgetsToAdd = widgets.filter(
        (widget) => !dbWidgets.some((dbWidget) => dbWidget.id === widget.id),
      );

      // process widgets for fresh start
      widgetsToAdd.forEach((widget) => {
        widget.userId = userId;
        widget.companyId = companyId;
      });

      // Filter for updates to existing widgets in db, excluding new widgets
      const widgetsToUpdate = dbWidgets.filter(
        (dbWidget) =>
          widgetUpdates[dbWidget.id] &&
          !widgetsToAdd?.find((w) => w.id === dbWidget.id),
      );

      // Identify IDs of widgets to remove
      const idsToRemove = dbWidgets
        .filter(
          (dbWidget) => !widgets.some((widget) => widget.id === dbWidget.id),
        )
        .map((widget) => widget.id);

      // create widgets with widgetsToAdd
      try {
        await createManyDashboardWidgetsQuery({ data: widgetsToAdd }, tx);
      } catch (addErr) {
        throw new Error("Error adding widgets: " + addErr.message);
      }

      // update each widget in widgetUpdates object from body
      try {
        for (const widget of widgetsToUpdate) {
          const changes = widgetUpdates[Number(widget.id)];
          await updateDashboardWidgetQuery({
            where: { id: widget.id },
            data: changes,
          });
        }
      } catch (updateErr) {
        throw new Error("Error updating widgets: " + updateErr.message);
      }

      // delete many widgets based on ids
      try {
        await deleteManyDashboardWidgetsQuery(
          { where: { id: { in: idsToRemove } } },
          tx,
        );
      } catch (removeErr) {
        throw new Error("Error removing widgets: " + removeErr.message);
      }

      return true;
    });

    sendNotification(
      `Widgets updated for dashboard: ${existingDashboard?.name}`,
    );

    const message = `Widgets replaced successfully`;
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Error updating dashboard widgets:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getWidgetsByDashboard, updateManyWidgets };

// if we need to simplify the updateManyWidgets , the whole try block could be simplified
//  by removing all previous widgets and adding the current ones:

/* try {
  await prisma.$transaction(async (tx) => {
    // Delete all existing widgets for the dashboard to start with clean slate
    await deleteManyDashboardWidgetsQuery(
      { where: { dashboardId: dashboardId } },
      tx
    );

    // Create new widgets
    await createManyDashboardWidgetsQuery({ data: widgets }, tx);

    return true;
  });

  const message = `Widgets replaced successfully`;
  return res.status(200).json({ message }); */
