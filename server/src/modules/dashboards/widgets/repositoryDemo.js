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

function getDummyDataForWidget(entity, criteria) {
  const key = `${entity}-${criteria}`;
  return dummyData[key] || 0; // Return 0 if no dummy data is found for the key
}

async function getEachWidgetValue(widgets, req) {
  // Assuming you no longer need widgetQueries for the demo
  const newItems = [];

  for (const widget of widgets) {
    try {
      const value = getDummyDataForWidget(widget.entity, widget.criteria);
      // Assuming newItems is an array of objects with widget details
      newItems.push({
        ...widget,
        value,
      });
    } catch (error) {
      console.error("Error fetching widget data:", error);
      // Handle error or push a default/error state
    }
  }

  return newItems;
}

const dummyData = {
  // Inventory
  "inventory-carsInInventory": 250,
  "inventory-carsInPrep": 75,
  "inventory-carsInStaging": 30,
  "inventory-activeCars": 200,
  "inventory-carsInTransit": 20,
  "inventory-liveInventory": 300,
  "inventory-frontLineReady": 150,
  "inventory-pendingCheckIn": 10,
  "inventory-pendingCheckOut": 5,
  "inventory-salesThisWeek": 15,
  "inventory-openIssues": 40,
  "inventory-issuesInProgress": 25,

  // Finance
  "finance-lateInvoicesTotal": 10000,
  "finance-lateInvoices": 15,
  "finance-unpaidInvoices": 20,
  "finance-paidInvoices": 200,
  "finance-invoicesDue": 30,
  "finance-invoicesOwed": 25,
  "finance-totalOwed": 50000,
  "finance-payReportsOwed": 10,

  // Tasks
  "tasks-tasksAssigned": 50,
  "tasks-lateTasks": 5,
  "tasks-unassignedTasks": 10,
  "tasks-tasksDue": 15,
  "tasks-upcomingJobs": 20,
  "tasks-blockedTasks": 3,

  // Parts
  "parts-partsInInventory": 500,
  "parts-partsTotalCost": 20000,

  // Repair Orders
  "repairOrders-totalOrders": 30, // Example
  "repairOrders-pendingOrders": 10, // Example

  // Labor Rate
  "laborRate-averageRate": 100, // Example

  // Add more as needed...
};

export {
  createManyDashboardWidgetsQuery,
  updateDashboardWidgetQuery,
  deleteManyDashboardWidgetsQuery,
  getDashboardWidgetsQuery,
  getDashboardWidgetCountQuery,
  getEachWidgetValue,
};
