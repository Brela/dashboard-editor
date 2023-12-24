import { API } from "./config";

export const getDashboards = async (queryParams) => {
  console.log("fn");
  try {
    const response = await API("/dashboards").get("/", { params: queryParams });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to get dashboards",
    );
  }
};

export const updateDashboard = async (dashboardId, data) => {
  try {
    const response = await API("/dashboards").patch(`/${dashboardId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update dashboard",
    );
  }
};

export const createDashboard = async (data) => {
  try {
    const response = await API("/dashboards").post("/", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create dashboard",
    );
  }
};

export const deleteDashboard = async (dashboardId) => {
  try {
    const response = await API("/dashboards").delete(`/${dashboardId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete dashboard",
    );
  }
};

export const getDashboardWidgets = async (dashboardId, queryParams) => {
  try {
    const response = await API("/dashboards").get(`/${dashboardId}/widgets`, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to get dashboard widgets",
    );
  }
};
// this takes care of adding, updating, and removing widgets onSave
export const updateManyWidgets = async (
  dashboardId,
  widgets,
  widgetUpdates,
) => {
  try {
    const response = await API("/dashboards").patch(`/${dashboardId}/widgets`, {
      widgets,
      widgetUpdates,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data?.errors || error);
    throw new Error("Failed to update widgets");
  }
};

// custom widgets - aka custom widget library

export const getCustomWidgets = async (queryParams) => {
  try {
    const response = await API("/customWidgets").get("/", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to get custom widgets",
    );
  }
};

export const createCustomWidget = async (data) => {
  try {
    const response = await API("/customWidgets").post("/", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create custom widget",
    );
  }
};

export const updateCustomWidget = async (customWidgetId, data) => {
  try {
    const response = await API("/customWidgets").patch(
      `/${customWidgetId}`,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update custom widget",
    );
  }
};

export const deleteCustomWidget = async (customWidgetId) => {
  try {
    const response = await API("/customWidgets").delete(`/${customWidgetId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete custom widget",
    );
  }
};
