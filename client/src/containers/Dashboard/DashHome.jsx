import { useContext } from "react";
import DashboardWidgetsLayout from "./DashWidgetsLayout";
import { AuthContext } from "../../contexts/auth.context";
import { Select } from "../../components";

import DashboardHeader from "./DashboardHeader/DashHeader";
import useDashboardData from "./hooks/useDashboardData";

const DashboardHome = () => {
  const { isLoggedIn, authLoading, userId } = useContext(AuthContext);

  const {
    dashboard,
    dashboards,
    isDashboardsLoading,
    refetchDashboardData,
    widgets,
    isWidgetsLoading,
    changeSelectedDashboard,
  } = useDashboardData({ isLoggedIn, authLoading, userId });

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
            </div>
          </section>
        </div>

        <div className="lg:px-4 rounded-md">
          <DashboardWidgetsLayout
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
