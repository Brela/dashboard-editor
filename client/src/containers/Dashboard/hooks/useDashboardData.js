import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  getDashboardWidgets,
  getDashboards,
  getDemoDashboards,
} from "../../../services/dashboardAPIcalls";

// this customm hook was created to share this data between the dashboard home and dashboard editor
const useDashboardData = ({ isLoggedIn, authLoading }) => {
  const [dashboard, setDashboard] = useState();

  // Fetch dashboards
  const queryKey = isLoggedIn ? ["dashboards", "user"] : ["dashboards", "demo"];
  const {
    data: dashboardsData,
    isLoading: isDashboardsLoading,
    refetch: refetchDashboards,
  } = useQuery(
    queryKey,
    // get demo dashboards gets the dashboards from a user defined in env
    () => (!isLoggedIn ? getDemoDashboards() : getDashboards()),
    {
      enabled: !authLoading,
      retries: 2,
      onSuccess: (data) => {
        // data will be the result of getDashboards or getDemoDashboards
        // Perform actions that depend on the updated dashboards data
        const newDashboards = data.items;
        changeSelectedDashboardAfterFetch(newDashboards);
      },
    },
  );

  const dashboards = dashboardsData ? dashboardsData.items : [];

  useEffect(() => {
    console.log("dashborads", dashboards);
    console.log("selected dashboard", dashboard);
  }, [dashboards, dashboard]);

  // Fetch widgets for the selected dashboard
  const {
    data: widgetsData,
    isLoading: isWidgetsLoading,
    refetch: refetchWidgets,
  } = useQuery(
    ["widgets", dashboard?.id],
    () => getDashboardWidgets(dashboard?.id),
    {
      enabled: !!dashboard, // the query will only run if dashboard is truthy.
      retries: 2,
    },
  );
  const widgets = widgetsData ? widgetsData.items : [];
  const refetchDashboardData = () => {
    refetchDashboards();
    refetchWidgets();
  };

  // const isLoading = isDashboardsLoading || isWidgetsLoading;

  const changeSelectedDashboardAfterFetch = (newDashboards) => {
    if (newDashboards.length > 0) {
      const storedDashboardId = localStorage.getItem("lastSelectedDashboardId");
      const defaultDashboard =
        newDashboards.find((d) => d.id === JSON.parse(storedDashboardId)) ||
        newDashboards[0];
      console.log("defaultDashboard", defaultDashboard);
      setDashboard(defaultDashboard);
    }
  };

  // Update local state when a new dashboard is selected
  const changeSelectedDashboard = (id) => {
    const newDashboard = dashboards.find((item) => item.id === id);
    if (newDashboard) {
      setDashboard(newDashboard); // Update local state
      localStorage.setItem("lastSelectedDashboardId", JSON.stringify(id));
    }
  };

  // Initialize with the first dashboard or from local storage when dashboards are loaded
  useEffect(() => {
    if (dashboards.length > 0) {
      const storedDashboardId = localStorage.getItem("lastSelectedDashboardId");
      const foundDashboard = dashboards.find(
        (d) => d.id === JSON.parse(storedDashboardId),
      );
      const defaultDashboard = foundDashboard || dashboards[0];
      setDashboard(defaultDashboard);
    }
  }, [dashboards]);

  return {
    dashboard,
    dashboards,
    isDashboardsLoading,
    refetchDashboardData,
    widgets,
    isWidgetsLoading,

    setDashboard,
    changeSelectedDashboard,
  };
};

export default useDashboardData;
