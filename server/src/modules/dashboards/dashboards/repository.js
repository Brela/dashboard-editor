import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllDashboardQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboard.findMany(data);
    } else {
      return await prisma.dashboard.findMany(data);
    }
  } catch (e) {
    console.log("------> Error executing getAllDashboardQuery", e);
    return null;
  }
};

const getOneDashboardQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboard.findFirst(data);
    } else {
      return await prisma.dashboard.findFirst(data);
    }
  } catch (e) {
    console.log("------> Error executing getOneDashboardQuery", e);
    return null;
  }
};

const getAllDashboardCountQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboard.count(data);
    } else {
      return await prisma.dashboard.count(data);
    }
  } catch (e) {
    console.log("------> Error executing getAllDashboardCountQuery", e);
    return null;
  }
};

const createDashboardQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboard.create(data);
    } else {
      return await prisma.dashboard.create(data);
    }
  } catch (e) {
    console.log("------> Error executing createDashboardQuery", e);
    return null;
  }
};

const updateManyDashboardQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboard.updateMany(data);
    } else {
      return await prisma.dashboard.updateMany(data);
    }
  } catch (e) {
    console.log("------> Error executing updateManyDashboardQuery", e);
    return null;
  }
};

const updateDashboardQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboard.update(data);
    } else {
      return await prisma.dashboard.update(data);
    }
  } catch (e) {
    console.log("------> Error executing updateDashboarQuery", e);
    return null;
  }
};

const deleteDashboardQuery = async (data, tx) => {
  try {
    if (tx) {
      return await tx.dashboard.delete(data);
    } else {
      return await prisma.dashboard.delete(data);
    }
  } catch (e) {
    console.error("------> Error executing deleteDashboardQuery", e);
    throw e;
  }
};

export {
  getAllDashboardQuery,
  getOneDashboardQuery,
  getAllDashboardCountQuery,
  createDashboardQuery,
  updateManyDashboardQuery,
  deleteDashboardQuery,
  updateDashboardQuery,
};
