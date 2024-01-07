import React, { useEffect, useState } from "react";
import { ICON_MAP } from "../../helpers/iconMap";
import { PlusIcon, MinusSmallIcon } from "@heroicons/react/24/outline";

import { Button, Tooltip } from "../../../../components";

import {
  inventoryWidgetsList,
  financeWidgetsList,
  taskWidgetsList,
  chartDisplayTypes,
} from "./widgetsLibrary";
import DeleteCustomWidgetModal from "../customWidgetModals/DeleteCustomWidget";
import AddCustomWidgetModal from "../customWidgetModals/AddCustomWidget";
import EditWidgetPopover from "../customWidgetModals/WidgetOptionsPopover";
import { getCustomWidgets } from "../../../../services/dashboardAPIcalls";
import { twMerge } from "tailwind-merge";
import { headerBg } from "../../../../css/globalTailwindVars";

const WidgetsSidebar = ({
  handleAddItem,
  dashboard,
  widgets,
  setNotification,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ name: null, id: null });
  const closeModal = () => setModal({ name: null, id: null });

  const [customWidgetsList, setCustomWidgetsList] = useState([]);

  const [widgetForOptionsPopover, setWidgetForOptionsPopover] = useState();

  /* const fetchCustomWidgets = async () => {
    setLoading(true);
    try {
      const data = await getCustomWidgets();
      // console.log(data.items);
      setCustomWidgetsList(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomWidgets();
  }, []); */

  const [financeWidgets_filtered, setFinanceWidgets_filtered] =
    useState(financeWidgetsList);
  const [inventoryWidgets_filtered, setInventoryWidgets_filtered] =
    useState(inventoryWidgetsList);
  const [taskWidgets_filtered, setTaskWidgets_filtered] =
    useState(taskWidgetsList);
  const [customWidgets_filtered, setCustomWidgets_filtered] =
    useState(customWidgetsList);

  // get only widgets that aren't on the dashboard
  useEffect(() => {
    if (widgets?.length === 0) return;
    setFinanceWidgets_filtered(
      financeWidgetsList.filter(
        (widgetOption) =>
          !widgets?.some(
            (widget) =>
              widget.name === widgetOption.name &&
              widget.displayType === widgetOption.displayType,
          ),
      ),
    );
    setInventoryWidgets_filtered(
      inventoryWidgetsList.filter(
        (widgetOption) =>
          !widgets?.some(
            (widget) =>
              widget.name === widgetOption.name &&
              widget.displayType === widgetOption.displayType,
          ),
      ),
    );
    setTaskWidgets_filtered(
      taskWidgetsList.filter(
        (widgetOption) =>
          !widgets?.some(
            (widget) =>
              widget.name === widgetOption.name &&
              widget.displayType === widgetOption.displayType,
          ),
      ),
    );
    setCustomWidgets_filtered(
      customWidgetsList.filter(
        (widgetOption) =>
          !widgets?.some(
            (widget) =>
              widget.name === widgetOption.name &&
              widget.displayType === widgetOption.displayType,
          ),
      ),
    );
  }, [dashboard, widgets]);

  // group the widgets so that they can use the same code when mapped over
  const [widgetLibraries, setWidgetLibraries] = useState();
  useEffect(() => {
    setWidgetLibraries([
      { name: "Inventory", widgets: inventoryWidgets_filtered },
      { name: "Finance", widgets: financeWidgets_filtered },
      { name: "Tasks", widgets: taskWidgets_filtered },
    ]);
  }, [
    inventoryWidgets_filtered,
    financeWidgets_filtered,
    taskWidgets_filtered,
  ]);

  return (
    <div className=" flex flex-col px-3 h-full">
      <section className="mb-10 h-[30vh] md:h-[75vh]">
        <h3 className="text-gray-500 tracking-wider text-xs font-medium pb-1 pt-2  px-2">
          Standard Widgets
        </h3>
        <div
          className={twMerge(
            " rounded-md p-0 h-full overflow-auto border",
            headerBg,
          )}
        >
          {widgetLibraries?.map((library) => (
            <div key={library.name}>
              <h4 className="text-center font-semibold text-gray-600 mx-5 text-sm mt-2">
                {library.name}
              </h4>
              <ul className="mt-1 p-2 rounded-sm min-h-[45px]">
                {library.widgets.map((widgetOption) => (
                  <li
                    key={widgetOption.id}
                    className="min-h-[30px] cursor-pointer border rounded-md bg-white text-gray-800 border-gray-400 mb-2 mx-2 p-2 hover:bg-cyan-100/10 flex gap-2 justify-start items-center overflow-hidden whitespace-wrap text-overflow-ellipsis"
                    onClick={() => handleAddItem(widgetOption)}
                  >
                    <div
                      className={`rounded-md p-1 md:p-1 bg-gray-400 ${
                        chartDisplayTypes.includes(widgetOption.displayType)
                          ? "border-2 border-orange-300"
                          : "border-2 border-white"
                      }`}
                    >
                      {ICON_MAP[widgetOption.icon] ? (
                        React.createElement(ICON_MAP[widgetOption.icon], {
                          className: "h-3 w-3 md:h-3 md:w-3 text-white",
                          "aria-hidden": "true",
                        })
                      ) : (
                        // to fix unknown bug for for the chart's icon
                        <widgetOption.icon
                          className="h-3 w-3 md:h-3 md:w-3 text-white"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="text-xs">
                      {widgetOption.name}{" "}
                      {chartDisplayTypes.includes(widgetOption.displayType) && (
                        <span>(chart)</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      {/* custom widgets */}
      {/* <section className="mb-6 h-[22vh] relative">
        <h3 className="text-gray-500 tracking-wider text-xs font-medium pb-1 pt-2  px-2">
          Custom Widgets
        </h3>
        <div className="rounded-md p-0 h-full overflow-auto border bg-gray-100">
          <ul className="mt-1 p-2 rounded-sm min-h-[45px]">
            {customWidgets_filtered.map((widgetOption) => (
              <li
                key={widgetOption.id}
                className="min-h-[30px] cursor-pointer border rounded-md bg-white text-gray-800 border-gray-400 mb-2 mx-2 p-2 hover:bg-slate-100 flex gap-2 justify-between items-center overflow-hidden whitespace-wrap text-overflow-ellipsis"
                onClick={() => handleAddItem(widgetOption)}
              >
                <section className="flex gap-2 justify-between items-center overflow-hidden whitespace-wrap text-overflow-ellipsis">
                  <div
                    className={`rounded-md p-1 md:p-1 bg-gray-400 ${
                      chartDisplayTypes.includes(widgetOption.displayType)
                        ? "border-2 border-orange-300"
                        : "border-2 border-white"
                    }`}
                  >
                    {ICON_MAP[widgetOption.icon] ? (
                      React.createElement(ICON_MAP[widgetOption.icon], {
                        className: "h-3 w-3 md:h-3 md:w-3 text-white",
                        "aria-hidden": "true",
                      })
                    ) : (
                      // fallback just in case icon wasn't mapped
                      <MinusSmallIcon
                        className="h-3 w-3 md:h-3 md:w-3 text-white"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="text-xs">
                    {widgetOption.name}{" "}
                    {chartDisplayTypes.includes(widgetOption.displayType) && (
                      <span>(chart)</span>
                    )}
                  </div>
                </section>
                <EditWidgetPopover setModal={setModal} id={widgetOption.id} />
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute right-2 -bottom-6 ">
          <Tooltip
            content="Add New Custom Widget"
            position="bottom"
            effect="solid"
            border={true}
            type="light"
          >
            <Button
              size="xs"
              variant="light"
              mode="outlined"
              className={"py-1 px-2 flex gap-1 items-center bg-white"}
              onClick={() => setModal({ name: "addCustomWidget" })}
            >
              <PlusIcon className="h-3 w-3" /> New
            </Button>
          </Tooltip>
        </div>
      </section> */}
      <DeleteCustomWidgetModal
        open={modal.name === "deleteWidget"}
        closeModal={closeModal}
        customWidgets={customWidgetsList}
        setCustomWidgetsList={setCustomWidgetsList}
        modal={modal}
        setNotification={setNotification}
      />
      <AddCustomWidgetModal
        open={modal.name === "addCustomWidget"}
        closeModal={closeModal}
        // fetchCustomWidgets={fetchCustomWidgets}
        // setCustomWidgets={setCustomWidgets_filtered}
      />
    </div>
  );
};

export default WidgetsSidebar;
