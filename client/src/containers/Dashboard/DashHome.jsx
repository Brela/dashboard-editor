import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashWidgetsLayout";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../../contexts/auth.context";
import { Tooltip, Select, Button } from "../../components";

import { useQuery } from "react-query";
import {
  getDashboardWidgets,
  getDashboards,
  getDemoDashboards,
} from "../../services/dashboardAPIcalls";
import DashboardHeader from "./DashboardHeader/DashHeader";

const DashboardHome = () => {
  const { isLoggedIn, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
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

  return (
    <>
      <DashboardHeader
        refetchDashboardData={refetchDashboardData}
        changeSelectedDashboard={changeSelectedDashboard}
      />
      <div className="mx-auto w-[90vw] lg:w-[85vw] pb-10">
        <div className="flex  items-center justify-center gap-x-2 p-2 mt-3">
          <section className="flex text-gray-500 flex-col gap-1 w-[50vw] md:w-[30vw] xl:w-[15vw]">
            {/* <span className="text-sm">Select Dashboard</span> */}
            <div className="flex items-center gap-1">
              <Select
                // label="Select Dashboard"
                options={dashboards?.map((dashboard) => ({
                  value: dashboard.id,
                  label: dashboard.name,
                }))}
                isDisabled={isDashboardsLoading}
                value={String(dashboard?.id)}
                className="w-full m-0 inline-flex text-md mr-2"
                onChange={(value) => {
                  changeSelectedDashboard(value);
                }}
              />
              {/*  <Tooltip
                content="Edit Dashboards"
                position="bottom"
                effect="solid"
                // border={true}
                type="light"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/dashboard/editor`)}
                >
                  <Cog6ToothIcon className="h-5 w-5 text-green-500" />
                </Button>
              </Tooltip> */}
            </div>
          </section>
        </div>

        <div className="lg:px-4 rounded-md">
          <DashboardLayout
            dashboards={dashboards}
            widgets={widgets}
            isEditMode={false}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
