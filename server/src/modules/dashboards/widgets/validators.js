import Joi from "joi";

const entityOptions = [
  "inventory",
  "finance",
  "tasks",
  "issues",
  "repairOrders",
  "laborRate",
  "parts",
  // Add more entities as needed
];

const criteriaOptions = [
  // inventory
  "carsInInventory",
  "carsInPrep",
  "carsInStaging",
  "activeCars",
  "carsInTransit",
  "liveInventory",
  "frontLineReady",
  "pendingCheckIn",
  "pendingCheckOut",
  "salesThisWeek",
  "openIssues",
  "issuesInProgress",

  // finance
  "lateInvoicesTotal",
  "lateInvoices",
  "unpaidInvoices",
  "paidInvoices",
  "invoicesDue",
  "invoicesOwed",
  "totalOwed",
  "payReportsOwed",

  // tasks
  "tasksAssigned",
  "lateTasks",
  "unassignedTasks",
  "tasksDue",
  "unassignedTasks",
  "upcomingJobs",
  "blockedTasks",

  // parts
  "partsInInventory",
  "partsTotalCost",
  // add more criterias as needed
];

const dashboardWidgetSchema = Joi.object({
  id: Joi.number().integer(),
  dashboardId: Joi.number().integer(),
  name: Joi.string(),
  entity: Joi.string()
    .required()
    .valid(...entityOptions), //   "inventory", "tasks", etc
  criteria: Joi.string()
    .required()
    .valid(...criteriaOptions), //   "carsInInventory", "carsInPrep", etc
  displayType: Joi.string().valid(
    "count",
    "total",
    "average",
    "percentage",
    "graph",
    "pie",
    "bar",
    "line",
  ),
  icon: Joi.string().required(),
  color: Joi.string().required(),
  navigationUrl: Joi.string(),

  i: Joi.string().required(),
  x: Joi.number().integer().required(),
  y: Joi.number().required(),
  w: Joi.number().integer().required(),
  h: Joi.number().required(),

  value: Joi.number(),
  userId: Joi.string(),
  companyId: Joi.number().integer(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

const validateWidgetArraySchema = (array) => {
  return Joi.array()
    .items(dashboardWidgetSchema)
    .validate(array, { abortEarly: false });
};

export { entityOptions, criteriaOptions, validateWidgetArraySchema };
