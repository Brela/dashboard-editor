import React, { useState, useEffect, useContext } from "react";
import ReactApexChart from "react-apexcharts";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../contexts/auth.context";
import { InventoryContext } from "../../contexts/inventory.context";
import {
  faBoxOpen,
  faShippingFast,
  faChevronUp,
  faChevronDown,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

function Stats() {
  const { userId } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState({
    inventory: false,
    orders: false,
    threshold: false,
  });
  const { needStatsUpdate, setNeedStatsUpdate, inventory } =
    useContext(InventoryContext);

  const [data, setData] = useState({
    totalInventoryItems: 0,
    totalActiveOrders: 0,
    inventoryItemsSpark: [],
    activeOrdersSpark: [],
  });

  const itemsWithDifference = Array.isArray(inventory)
    ? inventory.map((item) => ({
        ...item,
        difference: item.inStock - item.reorderAt,
      }))
    : [];

  itemsWithDifference.sort((a, b) => a.difference - b.difference);

  const itemsCloseToReorder = itemsWithDifference.filter(
    (item) => item.difference >= 0,
  );

  const top5Items = itemsCloseToReorder.slice(0, 5);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${API_URL}/inventory/stats/${userId}`)
        .then((response) => {
          setData(response.data);
          setNeedStatsUpdate(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [userId, needStatsUpdate]);

  const sparkOptions = {
    chart: {
      id: "basic-bar",
      type: "line",
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
    },
    fill: {
      opacity: 1,
    },
    colors: ["rgb(63, 191, 128)"],
  };

  const toggleOpen = () => {
    setIsOpen((prev) => ({
      inventory: !prev.inventory,
      orders: !prev.orders,
      threshold: !prev.threshold,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row text-zinc-800 gap-3 md:gap-6">
      <div className="bg-zinc-100 rounded-2xl p-4 md:w-1/3 flex flex-col gap-2">
        <div
          className="flex justify-between cursor-pointer"
          onClick={toggleOpen}
        >
          <h3 className="font-bold">
            <FontAwesomeIcon icon={faBoxOpen} className="mr-2 text-zinc-600" />
            Total Inventory
          </h3>
          <FontAwesomeIcon
            icon={isOpen.inventory ? faChevronUp : faChevronDown}
            className="text-zinc-400"
          />
        </div>

        {isOpen.inventory && (
          <div className="flex flex-col">
            <div className="flex gap-6">
              <p className="text-3xl flex flex-col items-center font-semibold text-zinc-600">
                <span className="">{data.totalDistinctItems}</span>{" "}
                <span className="text-sm">Items</span>
              </p>
              <p className="text-3xl flex flex-col items-center font-semibold text-zinc-600">
                <span className="">{data.totalInventoryItems}</span>
                <span className="text-sm">Stock</span>
              </p>
            </div>
            <ReactApexChart
              options={sparkOptions}
              series={[{ data: data.inventoryItemsSpark }]}
              type="area"
              height={"140px"}
            />
          </div>
        )}
      </div>

      <div className="bg-zinc-100 rounded-2xl p-4 md:w-1/3 flex flex-col gap-2">
        <div
          className="flex justify-between cursor-pointer"
          onClick={toggleOpen}
        >
          <h3 className="font-bold">
            <FontAwesomeIcon
              icon={faShippingFast}
              className="mr-2 text-zinc-600"
            />
            Total Active Orders
          </h3>
          <FontAwesomeIcon
            icon={isOpen.inventory ? faChevronUp : faChevronDown}
            className="text-zinc-400"
          />
        </div>
        {isOpen.orders && (
          <>
            <p className="text-3xl font-semibold text-zinc-600">
              {data.totalActiveOrders}
            </p>
            <ReactApexChart
              options={sparkOptions}
              series={[{ data: data.activeOrdersSpark }]}
              type="area"
              height={"150px"}
            />
          </>
        )}
      </div>

      <div className="bg-zinc-100 rounded-2xl p-4 md:w-1/3 flex flex-col gap-2">
        <div
          className="flex justify-between cursor-pointer"
          onClick={toggleOpen}
        >
          <h3 className="font-bold">
            <FontAwesomeIcon icon={faBell} className="mr-2 text-zinc-600" />
            Near Threshold
          </h3>
          <FontAwesomeIcon
            icon={isOpen.inventory ? faChevronUp : faChevronDown}
            className="text-zinc-400"
          />
        </div>
        {isOpen.threshold && (
          <>
            <table className="text-sm text-zinc-700 bg-zinc-200/60 rounded-lg mt-1">
              <thead className="">
                <tr className="border-b border-zinc-100 h-8">
                  <th>Item</th>
                  <th>Stock</th>
                  <th>Trigger</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                {top5Items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-none h-8 border-zinc-100"
                  >
                    <td className="px-2">{item.productName}</td>
                    <td className="px-2">{item.inStock}</td>
                    <td className="px-4">{item.reorderAt}</td>
                    <td className="px-8">{item.difference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default Stats;
