import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  getDashboardWidgets,
  getDashboards,
  getDemoDashboards,
} from "../services/dashboardAPIcalls";

// this customm hook was created to share this data between the dashboard home and dashboard editor
const useDashboardData = ({ isLoggedIn, authLoading, userId }) => {
  const [dashboard, setDashboard] = useState();

  const {
    data: dashboardsData,
    isLoading: isDashboardsLoading,
    refetch: refetchDashboards,
    error: dashboardError,
  } = useQuery(
    ["dashboards", isLoggedIn, userId],
    // get demo dashboards gets the dashboards from a user defined in env
    () => (!isLoggedIn ? getDemoDashboards() : getDashboards()),
    {
      enabled: !authLoading,
      retries: 2,
      onSuccess: (data) => {
        // data will be the result of getDashboards or getDemoDashboards
        // Perform actions that depend on the updated dashboards data
        // console.log("-- 1 -- ON SUCESS queryKey and Data: ", data);
      },
    },
  );

  // the endless loop problem is from this query running many times i believe
  // Fetch widgets for the selected dashboard
  const {
    data: widgetsData,
    isLoading: isWidgetsLoading,
    refetch: refetchWidgets,
  } = useQuery(
    ["widgets", dashboard?.id],
    () => getDashboardWidgets(dashboard?.id),
    {
      enabled: !!dashboard && !authLoading, // the query will only run if dashboard is truthy.
      retries: 2,
      onSuccess: (data) => {
        // console.log("-- Widg -- ON SUCESS", data);
      },
    },
  );
  const dashboards = dashboardsData ? dashboardsData.items : [];
  const widgets = widgetsData ? widgetsData.items : [];

  const refetchDashboardData = async () => {
    await refetchDashboards();
    refetchWidgets();
  };

  // const isLoading = isDashboardsLoading || isWidgetsLoading;

  // Initialize with the first dashboard or from local storage when dashboards are loaded
  useEffect(() => {
    if (dashboards.length < 1) return;
    if (dashboards.length > 0) {
      const storedDashboardId = localStorage.getItem("lastSelectedDashboardId");
      const foundDashboard = dashboards?.find(
        (d) => d.id === JSON.parse(storedDashboardId),
      );
      const defaultDashboard = foundDashboard || dashboards[0];
      setDashboard(defaultDashboard);
    }
  }, [dashboards, isLoggedIn, authLoading]);

  // Update local state when a new dashboard is selected
  const changeSelectedDashboard = (id) => {
    const newDashboard = dashboards?.find((item) => item.id === id);
    if (newDashboard) {
      setDashboard(newDashboard); // Update local state
      localStorage.setItem(
        "lastSelectedDashboardId",
        JSON.stringify(newDashboard?.id),
      );
    }
  };

  return {
    dashboard,
    dashboards,
    dashboardError,
    isDashboardsLoading,
    refetchDashboardData,
    widgets,
    isWidgetsLoading,
    setDashboard,
    changeSelectedDashboard,
  };
};

export default useDashboardData;
