import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createManyDashboardWidgetsQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboardWidget.createMany(data);
    } else {
      return await prisma.dashboardWidget.createMany(data);
    }
  } catch (e) {
    console.log("------> Error executing createManyDashboardWidgetQuery", e);
    return null;
  }
};

const updateDashboardWidgetQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboardWidget.update(data);
    } else {
      return await prisma.dashboardWidget.update(data);
    }
  } catch (e) {
    console.log("------> Error executing updateDashboardWidgetQuery", e);
    throw e;
  }
};

const deleteManyDashboardWidgetsQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboardWidget.deleteMany(data);
    } else {
      return await prisma.dashboardWidget.deleteMany(data);
    }
  } catch (e) {
    console.error("------> Error executing deleteManyDashboardWidgetsQuery", e);
    throw e;
  }
};

const getDashboardWidgetsQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboardWidget.findMany(data);
    } else {
      return await prisma.dashboardWidget.findMany(data);
    }
  } catch (e) {
    console.log("------> Error executing getDashboardWidgetsQuery", e);
    return null;
  }
};

const getDashboardWidgetCountQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboardWidget.count(data);
    } else {
      return await prisma.dashboardWidget.count(data);
    }
  } catch (e) {
    console.log("------> Error executing getDashboardWidgetCountQuery", e);
    return null;
  }
};

async function getEachWidgetValue(widgets, req) {
  const widgetQueries = createWidgetQueries(req?.companyId);
  const newItems = [];

  for (const widget of widgets) {
    try {
      const queryKey = `${widget.entity}-${widget.criteria}-${widget.displayType}`;
      const queryFunction = widgetQueries[queryKey];

      if (queryFunction) {
        const value = await queryFunction();
        newItems.push({ ...widget, value });
      } else {
        // Add an error indication to the widget
        newItems.push({
          ...widget,
          error: "Configure backend queries in getEachWidgetValue()",
        });
      }
    } catch (error) {
      // Catch and handle specific or general errors
      newItems.push({ ...widget, error: "Error fetching widget data" });
    }
  }

  return newItems;
}

async function countCars({ companyId, condition }) {
  return await prisma.car.count({ where: { companyId, ...condition } });
}
async function countTasks({ companyId, condition }) {
  return await prisma.task.count({ where: { companyId, ...condition } });
}
async function countInvoices({ companyId, condition }) {
  return await prisma.invoice.count({ where: { companyId, ...condition } });
}
// to-do
async function countParts({ companyId }) {
  return await prisma.part.count({ where: { companyId, ...condition } });
}

function createWidgetQueries(companyId) {
  return {
    // "entity-criteria-displayType"

    // -------   inventory  -----------
    // cars in inventory
    "inventory-carsInInventory-count": () => countCars({ companyId }),

    // active cars
    "inventory-activeCars-count": () =>
      countCars({ companyId, condition: { active: true } }),

    // staging cars
    "inventory-carsInStaging-count": () =>
      countCars({ companyId, condition: { staging: true } }),

    // cars in transit
    "inventory-carsInTransit-count": () =>
      countCars({ companyId, condition: { inTransit: true } }),

    // front line ready
    "inventory-frontLineReady-count": () =>
      countCars({ companyId, condition: { frontLineReady: true } }),

    // open vehicle issues
    "inventory-openVehicleIssues-count": () =>
      countCars({
        companyId,
        condition: {
          vehicleIssues: {
            some: {
              status: "open",
            },
          },
        },
      }),

    // vehicle issues in progress
    "inventory-vehicleIssuesInProgress-count": () =>
      countCars({
        companyId,
        condition: {
          vehicleIssues: {
            some: {
              status: "in_progress",
            },
          },
        },
      }),

    // -------   finance  -----------

    // Late Invoices Total
    "finance-lateInvoicesTotal-count": () =>
      countInvoices({
        companyId,
        condition: {
          // to-do
        },
      }),

    // Late Invoices
    "finance-lateInvoices-count": () =>
      countInvoices({
        companyId,
        condition: {
          // to-do
        },
      }),

    // Unpaid Invoices
    "finance-unpaidInvoices-count": () =>
      countInvoices({
        companyId,
        condition: {
          paid: false, // to-do
        },
      }),

    // Paid Invoices
    "finance-paidInvoices-count": () =>
      countInvoices({
        companyId,
        condition: {
          paid: true, // to-do
        },
      }),

    // Invoices Due
    "finance-invoicesDue-count": () =>
      countInvoices({
        companyId,
        condition: {
          // to-do
        },
      }),

    // Invoices Owed
    "finance-invoicesOwed-count": () =>
      countInvoices({
        companyId,
        condition: {
          // to-do
        },
      }),

    // Invoices Owed - Total   to-do
    "finance-invoicesOwed-total": async ({ companyId }) => {
      try {
        const result = await prisma.invoice.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            paid: false,
            serviceInstances: {
              some: {
                companyId: companyId,
              },
            },
          },
        });
        console.log(result);
        return result._sum.amount || 0;
      } catch (error) {
        console.error("Error in finance-invoicesOwed-total:", error);
        return 0; // Handle the error as appropriate
      }
    },

    // -------   tasks  -----------
    // Tasks Assigned
    "tasks-tasksAssigned-count": () =>
      countTasks({
        companyId,
        condition: {
          userId: { not: null }, // assuming a task is assigned if userId is not null
        },
      }),

    // Tasks Due
    "tasks-tasksDue-count": () =>
      countTasks({
        companyId,
        condition: {
          // to-do
          completionDate: {
            lte: new Date(), // 'lte' means 'less than or equal to'
          },
        },
      }),

    // Late Tasks
    "tasks-lateTasks-count": () =>
      countTasks({
        companyId,
        condition: {
          status: "late", // to-do
        },
      }),

    // Unassigned Tasks
    "tasks-unassignedTasks-count": () =>
      countTasks({
        companyId,
        condition: {
          userId: null, // assuming a task is unassigned if userId is null
        },
      }),

    // Upcoming Jobs
    "tasks-upcomingJobs-count": () =>
      countTasks({
        companyId,
        condition: {
          kind: "upcomingJob", //to-do
        },
      }),

    // Blocked Tasks
    "tasks-blockedTasks-count": () =>
      countTasks({
        companyId,
        condition: {
          blocked: true,
        },
      }),

    // "issues",
    // "repairOrders",
    // "laborRate",

    // -------   parts  -----------
    //to-do
    "parts-partsInInventory-count": () => countParts({ cId }),
    // to-do
    "parts-partsTotalCost-total": async ({ companyId }) => {
      try {
        const result = await prisma.part.aggregate({
          _sum: { costPerEach: true },
          where: { companyId },
        });
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(result._sum.costPerEach || 0);
      } catch (error) {
        console.error("Error in parts-partsTotalCost-total:", error);
        throw error; // or return a default value
      }
    },
  };
}

export {
  createManyDashboardWidgetsQuery,
  updateDashboardWidgetQuery,
  deleteManyDashboardWidgetsQuery,
  getDashboardWidgetsQuery,
  getDashboardWidgetCountQuery,
  getEachWidgetValue,
};
