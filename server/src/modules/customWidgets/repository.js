import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllCustomWidgetsQuery = async (data, tx) => {
  try {
    return tx
      ? await tx.customWidget.findMany(data)
      : await prisma.customWidget.findMany(data);
  } catch (e) {
    console.error("------> Error executing getAllCustomWidgetsQuery", e);
    throw e;
  }
};

const getOneCustomWidgetQuery = async (data, tx) => {
  try {
    return tx
      ? await tx.customWidget.findUnique(data)
      : await prisma.customWidget.findUnique(data);
  } catch (e) {
    console.error("------> Error executing getOneCustomWidgetQuery", e);
    throw e;
  }
};

const getAllCustomWidgetsCountQuery = async (data, tx) => {
  try {
    return tx
      ? await tx.customWidget.count(data)
      : await prisma.customWidget.count(data);
  } catch (e) {
    console.error("------> Error executing getAllCustomWidgetsCountQuery", e);
    throw e;
  }
};

const createCustomWidgetQuery = async (data, tx) => {
  try {
    return tx
      ? await tx.customWidget.create(data)
      : await prisma.customWidget.create(data);
  } catch (e) {
    console.error("------> Error executing createCustomWidgetQuery", e);
    throw e;
  }
};

const updateCustomWidgetQuery = async (data, tx) => {
  try {
    return tx
      ? await tx.customWidget.update(data)
      : await prisma.customWidget.update(data);
  } catch (e) {
    console.error("------> Error executing updateCustomWidgetQuery", e);
    throw e;
  }
};

const deleteCustomWidgetQuery = async (data, tx) => {
  try {
    return tx
      ? await tx.customWidget.delete(data)
      : await prisma.customWidget.delete(data);
  } catch (e) {
    console.error("------> Error executing deleteCustomWidgetQuery", e);
    throw e;
  }
};

export {
  getAllCustomWidgetsQuery,
  getOneCustomWidgetQuery,
  getAllCustomWidgetsCountQuery,
  createCustomWidgetQuery,
  updateCustomWidgetQuery,
  deleteCustomWidgetQuery,
};
