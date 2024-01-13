// for now, only going to allow the first dashboard's adjustments to save to local storage, but can hit reset button to start over
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { useQueryClient, useQuery } from "react-query";
import { updateManyWidgets } from "../../../services/dashboardAPIcalls.js";

import { chartDisplayTypes } from "./WidgetsSidebar/widgetsLibrary.js";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  Button,
  Popover,
  Spinner,
} from "../../../components/index.jsx";
import { Tooltip } from "react-tooltip";

import DashWidgetsLayout from "../DashWidgetsLayout.jsx";
import EditDashboardNameModal from "./dashboardModals/EditDashboardName.jsx";
import AddNewDashboardModal from "./dashboardModals/AddNewDashboard.jsx";
import DeleteDashboardModal from "./dashboardModals/DeleteDashboard.jsx";
import { toast } from "react-hot-toast";
import useWindowSize from "../../../hooks/useWindowSize.js";

import { getNewXandYCoords } from "../helpers/layoutUtils.js";
import WidgetsSidebar from "./WidgetsSidebar/WidgetsSidebar.jsx";
import ConfirmUnsavedChanges from "./dashboardModals/ConfirmUnsavedChanges.jsx";
import { AuthContext } from "../../../contexts/auth.context.jsx";
import { DashboardContext } from "../../../contexts/dash.context.jsx";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import useDashboardData from "../../../hooks/useDashboardData.js";

const DashboardEditor = () => {
  const { isLoggedIn, authLoading, userId } = useContext(AuthContext);
  const {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    openConfirmUnsavedModal,
    setOpenConfirmUnsavedModal,
    useEditorInMobileAnyway,
    setUseEditorInMobileAnyway,
  } = useContext(DashboardContext);

  // currently - trying to figure out confirmUsavedChanges modal

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isWindowSmall = useWindowSize(1530);

  const [modal, setModal] = useState({ name: null, id: null });
  const closeModal = () => setModal({ name: null, id: null });
  const [autoAddNewOpen, setAutoAddNewOpen] = useState(true);

  const [widgets, setUnsavedWidgets] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!isLoggedIn) return toast("Please log in to save a dashboard.  ➡️");
    setLoading(true);
    try {
      const widgetUpdates = {};
      widgets.forEach((widget) => {
        widgetUpdates[widget.id] = {
          x: widget.x,
          y: widget.y,
          // include other properties to update as needed
        };
      });

      await updateManyWidgets(dashboard?.id, widgets, widgetUpdates);

      // Invalidate and refetch widgets to update the local cache
      queryClient.invalidateQueries(["widgets", dashboard?.id]);

      toast.success(`${dashboard?.name} saved.`);
      setHasUnsavedChanges(false);
      return `${dashboard?.name} saved.`; // Return a success message
    } catch (error) {
      console.error("error: ", error);
      toast.error(
        `Could not save ${dashboard?.name}: ${error.message}. Please try again`,
      );
      setHasUnsavedChanges(false);
      throw error; // Throw the error
    } finally {
      setLoading(false);
    }
  };

  const {
    dashboard,
    dashboards,
    dashboardError,
    isDashboardsLoading,
    refetchDashboardData,
    widgets: widgetsFromDb,
    isWidgetsLoading,
    changeSelectedDashboard,
  } = useDashboardData({ isLoggedIn, authLoading, userId });

  document.title = `Editing Dashboard: ${dashboard?.name}`;

  // Update localWidgets state ( which will hold the edited widgets ) when widgetsData ( widgets from database ) changes
  useEffect(() => {
    if (isWidgetsLoading || isDashboardsLoading) return;
    // I believe this was the culprit for endless loop, adding the if contitions mitigated the loop to only run a few times
    console.log("pos endless loop -----");
    if (!isWidgetsLoading && !isDashboardsLoading) {
      setUnsavedWidgets(widgetsFromDb);
    }
  }, [widgetsFromDb, isWidgetsLoading, isDashboardsLoading]);

  // const isLoading = isDashboardsLoading || isWidgetsLoading;

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

    setUnsavedWidgets((prevWidgets) => [...prevWidgets, newWidget]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveItem = async (e, widget) => {
    // console.log(widget);
    if (!widget.i) {
      return;
    }
    try {
      setUnsavedWidgets((prevWidgets) =>
        prevWidgets.filter((item) => item.i !== widget.i),
      );

      setHasUnsavedChanges(true);
    } catch (error) {
      console.error("Error deleting widget:", error);
    }
  };

  // operation - FEL - find endless loop
  // When a dashboard is deleted, select the first dashboard if available
  useEffect(() => {
    // here, loop runs many times - problem is somewhere that needs to run the below check
    if (dashboards.length < 1) return;
    // here it only runs once
    if (!dashboard || !dashboards?.find((d) => d.id === dashboard.id)) {
      const storedDashboardId = localStorage.getItem("lastSelectedDashboardId");
      const storedDashboardExists = dashboards.some(
        (d) => d.id === JSON.parse(storedDashboardId),
      );
      const defaultDashboard = storedDashboardExists
        ? dashboards.find((d) => d.id === JSON.parse(storedDashboardId))
        : dashboards[0] || null;

      changeSelectedDashboard(defaultDashboard?.id);
      if (defaultDashboard) {
        localStorage.setItem(
          "lastSelectedDashboardId",
          JSON.stringify(defaultDashboard.id),
        );
      } else {
        localStorage.removeItem("lastSelectedDashboardId");
      }
    }
  }, [dashboards]);

  const handleWidgetMoved = (movedWidgets) => {
    let updatedWidgets = movedWidgets.map((movedWidget) => {
      const originalWidget = widgets?.find(
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
    setUnsavedWidgets(updatedWidgets);
    setHasUnsavedChanges(true);

    // console.table(updatedWidgets);
  };

  if (isDashboardsLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  /*   if (isDashboardsLoading || isWidgetsLoading) {
    return <div>Loading...</div>;
  } */
  if (dashboardError) {
    return (
      <div>
        <p>Error loading dashboards: {dashboardError.message}</p>
      </div>
    );
  }

  return (
    <>
      {/* {isWindowSmall && !useEditorInMobileAnyway && (
        <div className=" z-30 p-10 absolute top-0 left-0 w-full h-full bg-gray-900/70 text-white flex flex-col gap-5 items-center justify-center">
          <section className="md:w-[60vw] text-center">
            <h4 className="font-semibold text-2xl mb-6">
              Please increase screen width to use editor.
            </h4>
            <p className="text-lg">
              Dashboards are responsive if editor is used on desktop ( should
              have 4 widgets per row ).
            </p>
            <p className="text-lg">
              {`Click button below if you would like to still use the editor - widgets will not be responsive.`}
            </p>
          </section>
          <Button
            size="sm"
            variant="ghost"
            className="bg-cyan-700/90 hover:bg-cyan-600/90 text-white"
            onClick={() => setUseEditorInMobileAnyway(true)}
          >
            Use Anyway
          </Button>
        </div>
      )} */}

      <div className="w-full px-7">
        <section className="flex justify-between items-end py-1 px-3">
          <div className="invisible basis-1/3"></div>

          <div className="md:pl-8 basis-1/3 relative flex items-center md:justify-center pt-4 pb-2">
            <Select
              key={dashboards.length}
              options={dashboards?.map((dashboard) => ({
                value: dashboard.id,
                label: dashboard.name,
              }))}
              className="m-0 inline-flex w-[170px] md:w-[200px] text-md mr-2"
              value={dashboard ? String(dashboard.id) : ""}
              onChange={(value) => {
                setHasUnsavedChanges(false);
                changeSelectedDashboard(value);
              }}
            />

            <Tooltip variant="info" id="addDash" style={{ zIndex: 2000 }}>
              Add New Dashboard
            </Tooltip>
            <Button
              data-tooltip-id="addDash"
              size="sm"
              variant="ghost"
              onClick={() => setModal({ name: "addDashboard" })}
            >
              <PlusIcon className="h-5 w-5" />
            </Button>

            <Popover
              contentClassName="p-0 m-2 mr-5"
              trigger={
                <div className="p-1 hover:bg-gray-200 rounded-md">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </div>
              }
              content={
                <div className="z-10 mt-2 py-2 px-5 rounded-md bg-white shadow-lg ring-1 ring-gray-700 ring-opacity-20 focus:outline-none">
                  <Tooltip variant="info" id="editName">
                    Edit Dashboard Name
                  </Tooltip>
                  <Button
                    data-tooltip-id="editName"
                    size="sm"
                    variant="ghost"
                    onClick={() => setModal({ name: "editDashboard" })}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Button>

                  <Tooltip variant="info" id="deleteDash">
                    Delete Dashboard
                  </Tooltip>
                  <Button
                    data-tooltip-id="deleteDash"
                    size="sm"
                    variant="ghost"
                    onClick={() => setModal({ name: "deleteDashboard" })}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              }
            />
          </div>
          {/*  <Tooltip variant="info" id="saveDash">
            Save Dashboard Layout
          </Tooltip> */}
          <div className="basis-1/3 flex items-end justify-end">
            {hasUnsavedChanges && (
              <Button
                data-tooltip-id="saveDash"
                onClick={handleSave}
                variant={"success"}
                className="ml-3 py-1 mb-1 bg-green-500/90"
                isLoading={loading}
              >
                Save Layout
              </Button>
            )}
          </div>
          {/* <div className="invisible"></div> */}
        </section>
        <div className="grid grid-cols-12 h-[80vh]">
          <div className="col-span-12 md:col-span-4 lg:col-span-2">
            <WidgetsSidebar
              handleAddItem={handleAddItem}
              dashboard={dashboard}
              widgets={widgets}
            />
          </div>
          {/* this is the actual react-grid-layout dashboard - besides here, it is called from CompanyDashboard and SoftwareDashboard */}
          <DashWidgetsLayout
            dashboards={dashboards}
            widgets={widgets}
            isWidgetsLoading={isWidgetsLoading}
            isDashboardsLoading={isDashboardsLoading}
            isEditMode={true}
            onWidgetMoved={handleWidgetMoved}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        <AddNewDashboardModal
          open={modal.name === "addDashboard"}
          closeModal={closeModal}
          setAutoAddNewOpen={setAutoAddNewOpen}
          dashboards={dashboards}
          changeSelectedDashboard={changeSelectedDashboard}
        />

        <ConfirmUnsavedChanges
          open={openConfirmUnsavedModal}
          closeModal={() => setOpenConfirmUnsavedModal(false)}
          resetUnsavedChangesState={() => setHasUnsavedChanges(false)}
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
