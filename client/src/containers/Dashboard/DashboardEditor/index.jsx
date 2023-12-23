// for now, only going to allow the first dashboard's adjustments to save to local storage, but can hit reset button to start over
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";

import { useQueryClient, useQuery } from "react-query";
import { getDashboardWidgets, getDashboards, updateManyWidgets } from "../api";

import { chartDisplayTypes } from "./WidgetsSidebar/widgetsLibrary";
import { v4 as uuidv4 } from "uuid";
import { Select, Button } from "../../../components";

import Dashboard from "../DashboardLayout";
import EditDashboardNameModal from "./dashboardModals/EditDashboardName";
import AddNewDashboardModal from "./dashboardModals/AddNewDashboard";
import DeleteDashboardModal from "./dashboardModals/DeleteDashboard";
import { notifySuccess, notifyError } from "../../../utils/notificationWrapper";

import { getNewXandYCoords } from "../helpers/layoutUtils";
import WidgetsSidebar from "./WidgetsSidebar/WidgetsSidebar";
import ConfirmUnsavedChanges from "./dashboardModals/ConfirmUnsavedChanges";

const DashboardEditor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [modal, setModal] = useState({ name: null, id: null });
  const closeModal = () => setModal({ name: null, id: null });

  const [dashboard, setDashboard] = useState();
  const [widgets, setWidgets] = useState();
  const [loading, setLoading] = useState(false);

  document.title = `Editing Dashboard: ${dashboard?.name}`;

  // ------------------------------------------------------------------------

  // on reload - asks user to continue without saving
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        const widgetUpdates = {};
        widgets.forEach((widget) => {
          widgetUpdates[widget.id] = {
            x: widget.x,
            y: widget.y,
            // include other properties to update as needed
          };
        });

        // console.log("widgetUpdates: --", widgetUpdates);

        await updateManyWidgets(dashboard?.id, widgets, widgetUpdates);

        // Invalidate and refetch widgets to update the local cache
        queryClient.invalidateQueries(["widgets", dashboard?.id]);

        notifySuccess(`${dashboard?.name} saved.`);

        resolve(`${dashboard?.name} saved.`); // Resolve the promise with a success message
      } catch (error) {
        console.error("error: ", error);
        notifyError(
          `Could not save ${dashboard?.name}: ${error.message}. Please try again`,
        );
        reject(error); // Reject the promise with the error
      } finally {
        setLoading(false);
        setHasUnsavedChanges(false);
      }
    });
  };

  // Fetch dashboards
  const {
    data: dashboardsData,
    isLoading: isDashboardsLoading,
    error: dashboardsError,
  } = useQuery("dashboards", getDashboards, {
    onError: (error) =>
      notifyError(`Error loading dashboards: ${error.message}`),
  });
  const dashboards = dashboardsData ? dashboardsData.items : [];

  // Fetch widgets for the selected dashboard
  const { data: widgetsData, isLoading: isWidgetsLoading } = useQuery(
    ["widgets", dashboard?.id],
    () => getDashboardWidgets(dashboard?.id),
    {
      enabled: !!dashboard, // the query will only run if dashboard is truthy.
      onError: (error) =>
        notifyError(`Error loading widgets: ${error.message}`),
    },
  );

  // Update localWidgets state when widgetsData changes
  useEffect(() => {
    if (widgetsData) {
      setWidgets(widgetsData.items);
    }
  }, [widgetsData]);

  // const isLoading = isDashboardsLoading || isWidgetsLoading;

  // Update local state when a new dashboard is selected
  const handleSelectionChange = (id) => {
    const newDashboard = dashboards.find((item) => item.id === id);
    if (newDashboard) {
      setDashboard(newDashboard); // Update local state
      localStorage.setItem("lastSelectedDashboardId", JSON.stringify(id));
    }
  };

  // Initialize with the dashboard from local storage when dashboards are loaded
  useEffect(() => {
    if (dashboards.length > 0) {
      const storedDashboardId = localStorage.getItem("lastSelectedDashboardId");
      const storedDashboardExists =
        storedDashboardId &&
        dashboards.some((d) => d.id === JSON.parse(storedDashboardId));

      // If the stored dashboard exists in the list, use it
      if (storedDashboardExists) {
        const newSelectedDashboard = dashboards.find(
          (d) => d.id === JSON.parse(storedDashboardId),
        );
        setDashboard(newSelectedDashboard);
      } else {
        // If not, default to the first dashboard
        const defaultDashboard = dashboards[0];
        setDashboard(defaultDashboard);
        localStorage.setItem(
          "lastSelectedDashboardId",
          JSON.stringify(defaultDashboard.id),
        );
      }
    } else {
      // if no dashboards
      setModal({ name: "addDashboard" });
    }
  }, [dashboards]);

  // When a dashboard is deleted, select the first dashboard if available
  useEffect(() => {
    if (!dashboard || !dashboards.find((d) => d.id === dashboard.id)) {
      const storedDashboardId = localStorage.getItem("lastSelectedDashboardId");
      const storedDashboardExists = dashboards.some(
        (d) => d.id === JSON.parse(storedDashboardId),
      );
      const defaultDashboard = storedDashboardExists
        ? dashboards.find((d) => d.id === JSON.parse(storedDashboardId))
        : dashboards[0] || null;

      setDashboard(defaultDashboard);
      if (defaultDashboard) {
        localStorage.setItem(
          "lastSelectedDashboardId",
          JSON.stringify(defaultDashboard.id),
        );
      } else {
        localStorage.removeItem("lastSelectedDashboardId");
      }
    }
  }, [dashboards, dashboard]);

  const handleAddItem = async (widgetOptions) => {
    const { name, entity, criteria, displayType, icon, color, navigationUrl } =
      widgetOptions;

    const existingWidgets = widgets || [];
    const isChart = chartDisplayTypes.includes(displayType);
    const widgetsPerRow = 4;
    const regularDims = {
      w: 1,
      h: 1,
    };
    const chartDims = {
      w: 2,
      h: 2,
    };

    const [newX, newY] = getNewXandYCoords(
      existingWidgets,
      widgetsPerRow,
      isChart,
      regularDims,
      chartDims,
    );

    const tempKey = String(uuidv4());

    const newWidget = {
      name,
      entity,
      criteria,
      displayType,
      icon,
      color,
      navigationUrl,

      // this 'i' key is needed by react-grid-layout
      i: tempKey,
      x: newX || 0,
      y: newY || 0,
      w: isChart ? chartDims.w : regularDims.w,
      h: isChart ? chartDims.h : regularDims.h,

      dashboardId: dashboard.id,
    };

    // console.log(newWidget.x);
    // console.log(newWidget.y);

    setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveItem = async (e, widget) => {
    // console.log(widget);
    if (!widget.i) {
      return;
    }
    try {
      setWidgets((prevWidgets) =>
        prevWidgets.filter((item) => item.i !== widget.i),
      );

      setHasUnsavedChanges(true);
    } catch (error) {
      console.error("Error deleting widget:", error);
    }
  };

  const handleWidgetMoved = (movedWidgets) => {
    let updatedWidgets = movedWidgets.map((movedWidget) => {
      const originalWidget = widgets.find(
        (widget) => widget.i === movedWidget.i,
      );
      return {
        ...originalWidget,
        x: movedWidget.x,
        y: movedWidget.y,
      };
    });

    const sortWidgets = (widgets) => {
      return widgets.sort((a, b) => {
        if (a.y === b.y) {
          return a.x - b.x; // If y is the same, sort by x
        }
        return a.y - b.y; // Otherwise, sort by y
      });
    };
    updatedWidgets = sortWidgets(updatedWidgets);

    // Update the widgets state
    setWidgets(updatedWidgets);
    setHasUnsavedChanges(true);

    // console.table(updatedWidgets);
  };

  if (isDashboardsLoading || isWidgetsLoading) {
    return <div>Loading...</div>;
  }
  if (dashboardsError) {
    return (
      <div>
        <p>Error loading dashboards: {dashboardsError.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen">
        <section className="flex justify-between items-center p-3">
          <button
            onClick={() => {
              hasUnsavedChanges
                ? setModal({ name: "confirmUnsaved" })
                : navigate("/dashboard");
            }}
            variant="light"
            className="border rounded-md px-2 m-2 py-1 text-slate-700 font-medium text-sm hover:text-slate-60 hover:bg-white"
          >
            <div className="flex items-center gap-1">
              <ArrowLeftCircleIcon className="h-4 w-4" />
              Exit
            </div>
          </button>
          <div className="flex items-center justify-start p-2">
            <Select
              key={dashboards.length}
              options={dashboards?.map((dashboard) => ({
                value: dashboard.id,
                label: dashboard.name,
              }))}
              className="m-0 inline-flex w-[200px] text-md mr-2"
              value={dashboard ? String(dashboard.id) : ""}
              onChange={(value) => {
                handleSelectionChange(value);
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setModal({ name: "editDashboard" })}
            >
              <PencilSquareIcon className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setModal({ name: "addDashboard" })}
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setModal({ name: "deleteDashboard" })}
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              variant="light"
              className={"ml-3"}
            >
              Save
            </Button>
          </div>
          <div className="invisible"></div>
        </section>
        <div className="grid grid-cols-12 h-[85vh]">
          <div className="col-span-4 md:col-span-4 lg:col-span-2">
            <WidgetsSidebar
              handleAddItem={handleAddItem}
              dashboard={dashboard}
              widgets={widgets}
            />
          </div>
          {/* this is the actual react-grid-layout dashboard - besides here, it is called from CompanyDashboard and SoftwareDashboard */}
          <Dashboard
            isEditMode={true}
            widgets={widgets}
            onWidgetMoved={handleWidgetMoved}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        <AddNewDashboardModal
          open={modal.name === "addDashboard"}
          closeModal={closeModal}
          dashboards={dashboards}
          handleSelectionChange={handleSelectionChange}
        />

        <ConfirmUnsavedChanges
          open={modal.name === "confirmUnsaved"}
          closeModal={closeModal}
          onSave={handleSave}
        />
        {dashboard && (
          <>
            <EditDashboardNameModal
              open={modal.name === "editDashboard"}
              closeModal={closeModal}
              dashboard={dashboard}
            />
            <DeleteDashboardModal
              open={modal.name === "deleteDashboard"}
              closeModal={closeModal}
              dashboard={dashboard}
            />
          </>
        )}
      </div>
    </>
  );
};
export default DashboardEditor;
