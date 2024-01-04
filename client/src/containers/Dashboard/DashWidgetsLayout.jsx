import React, { useState, useEffect } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  generateThreeColumnLayout,
  generateTwoColumnLayout,
} from "./helpers/layoutUtils";
import { twMerge } from "tailwind-merge";

import WidgetContent from "./components/WidgetContent";
import { Button, Spinner } from "../../components";

import PieChart from "./components/charts/PieChart";
import LineChart from "./components/charts/LineChart";
import BarChart from "./components/charts/BarChart";

import { chartDisplayTypes } from "./DashboardEditor/WidgetsSidebar/widgetsLibrary";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { ICON_MAP } from "./helpers/iconMap";
import EmptyDashboard from "./components/EmptyDashboard";
import { dashboardBg } from "../../css/globalTailwindVars";

// this has to go outside of the DashWidgetsLayout  function
const ResponsiveGridLayout = WidthProvider(Responsive);

const DashWidgetsLayout = ({
  isEditMode,
  dashboards,
  widgets,
  isDashboardsLoading,
  isWidgetsLoading,
  onWidgetMoved,
  onRemoveItem,
}) => {
  const [smLayout, setSmLayout] = useState();
  const [xxsLayout, setXxsLayout] = useState();

  const [isWidgetDragging, setIsWidgetDragging] = useState(false);

  // this is used to responsive layouts to provide to react-grid-layout
  useEffect(() => {
    if (isDashboardsLoading || isWidgetsLoading) return;
    console.log("-- 6 --: ");
    if (widgets && widgets.length > 0) {
      setSmLayout(generateThreeColumnLayout(widgets));
      setXxsLayout(generateTwoColumnLayout(widgets));
    }

    /*     console.log("fresh widgets: -----");
    console.table(
      widgets?.map((item) => ({
        Name: item.name,
        X: item.x,
        Y: item.y,
        Error: item.error,
      })),
    ); */
  }, [widgets]);

  if (isDashboardsLoading || isWidgetsLoading) {
    return (
      <EmptyDashboard
        className={isEditMode ? dashboardBg + " h-[80vh] mt-0 px-0" : ""}
        message={
          <div>
            <Spinner />
          </div>
        }
      />
    );
  } else if (!dashboards || dashboards.length === 0) {
    return (
      <EmptyDashboard
        className={isEditMode ? dashboardBg + " h-[80vh] mt-0 px-0" : ""}
        message="No dashboards found. To add a dashboard, click the settings icon above."
      />
    );
  } else if (!isEditMode && (!widgets || widgets.length === 0)) {
    return (
      <EmptyDashboard
        className={isEditMode ? dashboardBg + " h-[80vh] mt-0 px-0" : ""}
        message="You don't have any widgets on this dashboard! Click Dashboard Editor above to add some widgets."
      />
    );
  }

  console.log("widgets: ", widgets);
  return (
    <section
      className={twMerge(
        "col-span-8 lg:col-span-10 mr-3 mt-1 ml-1 rounded-md ",
        isEditMode && dashboardBg,
      )}
      style={
        isEditMode
          ? {
              border: "1px dashed",
              borderWidth: "1px",
              borderColor: "#b5b5b5",
            }
          : {}
      }
    >
      {widgets && widgets.length !== 0 ? (
        <ResponsiveGridLayout
          className="widgets "
          layouts={{
            lg: widgets || [],
            md: smLayout || [],
            sm: xxsLayout || [],
            xxs: xxsLayout || [],
          }}
          isResizable={false}
          isDraggable={isEditMode}
          compactType="vertical"
          margin={[14, 14]} // [Horizontal Margin, Vertical Margin]
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 4, md: 3, sm: 2, xs: 2, xxs: 2 }}
          onDragStart={() => {
            setIsWidgetDragging(true);
          }}
          onDragStop={(widgets) => {
            onWidgetMoved(widgets);
            setIsWidgetDragging(false);
          }}
          draggableCancel=".draggableCancel"
        >
          {widgets?.length &&
            widgets?.map((block) => {
              // Map the string in block.icon back to its corresponding icon component
              const IconComponent = ICON_MAP[block.icon];
              return (
                <div
                  key={block.i}
                  className={twMerge(
                    "relative overflow-hidden h-full rounded-lg shadow bg-white px-4 pb-12 pt-5 sm:px-6 sm:pt-6",
                    isEditMode ? "cursor-pointer" : "",
                  )}

                  // style={{ boxShadow: "0 1px 2px 2px rgba(0, 0, 0, 0.07)" }}
                >
                  {["count", "total", "average", "percentage"].includes(
                    block.displayType,
                  ) && (
                    <div>
                      <WidgetContent
                        isEditMode={isEditMode}
                        block={block}
                        IconComponent={IconComponent}
                      />

                      {isEditMode && (
                        <RemoveBlockXButton
                          block={block}
                          onRemoveItem={onRemoveItem}
                        />
                      )}
                    </div>
                  )}
                  {chartDisplayTypes.includes(block.displayType) && (
                    <div>
                      <p className="ml-16 pb-3 truncate text-sm font-medium text-gray-500">
                        {block.name}
                      </p>
                      {block.displayType === "pie" && (
                        <PieChart
                          labels={[
                            "Less than 3 Days",
                            "3-10 Days",
                            "10-20 Days",
                            "More than 20 Days",
                          ]}
                          seriesData={[25, 30, 20, 10]}
                          width="370"
                        />
                      )}
                      {block.displayType === "bar" && <BarChart />}
                      {block.displayType === "line" && (
                        <LineChart
                          categories={["M", "T", "W", "Th", "F", "S", "Su"]}
                          seriesData={[3, 5.4, 10, 11.4, 7.7, 8, 10]}
                          width="95%"
                          height="200"
                          useMapping={true}
                          isDragging={isWidgetDragging}
                          mapping={{
                            M: "Monday",
                            T: "Tuesday",
                            W: "Wednesday",
                            Th: "Thursday",
                            F: "Friday",
                            S: "Saturday",
                            Su: "Sunday",
                          }}
                        />
                      )}

                      {isEditMode && (
                        <RemoveBlockXButton
                          block={block}
                          onRemoveItem={onRemoveItem}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </ResponsiveGridLayout>
      ) : (
        <div className="flex justify-center items-center h-full">
          Add some widgets from left sidebar.
        </div>
      )}
    </section>
  );
};

export default DashWidgetsLayout;

const RemoveBlockXButton = ({ block, onRemoveItem }) => {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="remove draggableCancel"
      style={{
        cursor: "pointer",
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 2,
      }}
      onClick={(e) => onRemoveItem(e, block)}
    >
      <XMarkIcon className="h-7 w-7" />
    </Button>
  );
};
