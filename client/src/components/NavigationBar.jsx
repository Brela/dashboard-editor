import React, { useState, useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive,
  faBox,
  faShoppingCart,
  faTable,
} from "@fortawesome/free-solid-svg-icons";

export default function NavigationBar({ activeTab, setActiveTab }) {
  return (
    <div>
      <>
        <div className="flex mb-4 gap-x-4 sm:gap-x-1 font-semibold text-zinc-800 md:px-2">
          <button
            className={`w-1/3 sm:w-auto flex flex-col items-center sm:flex-row gap-1 sm:gap-0 px-1 sm:px-4 py-2 text-sm sm:text-base ${
              activeTab === "dashboard"
                ? "bg-cyan-700/20 rounded-xl "
                : "text-zinc-700"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FontAwesomeIcon
              icon={faTable}
              className="mr-1 sm:mr-2 text-xs sm:text-base text-zinc-500"
            />{" "}
            Dashboard
          </button>
          <button
            className={`w-1/3 sm:w-auto flex flex-col items-center sm:flex-row gap-1 sm:gap-0 px-1 sm:px-4 py-2 text-sm sm:text-base ${
              activeTab === "inventory"
                ? "bg-cyan-700/20 rounded-xl "
                : "text-zinc-700"
            }`}
            onClick={() => setActiveTab("inventory")}
          >
            <FontAwesomeIcon
              icon={faBox}
              className="mr-1 sm:mr-2 text-xs sm:text-base text-zinc-500"
            />{" "}
            Inventory
          </button>
          <button
            className={`w-1/3 sm:w-auto flex flex-col items-center sm:flex-row gap-1 sm:gap-0 px-1 sm:px-4 py-2 text-sm sm:text-base ${
              activeTab === "Active Orders"
                ? "bg-cyan-700/20 rounded-xl "
                : "text-zinc-700"
            }`}
            onClick={() => setActiveTab("Active Orders")}
          >
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="mr-1 sm:mr-2 text-xs sm:text-base text-zinc-500"
            />{" "}
            Active Orders
          </button>
          <button
            className={`w-1/3 sm:w-auto flex flex-col items-center sm:flex-row gap-1 sm:gap-0 px-1 sm:px-4 py-2 text-sm sm:text-base ${
              activeTab === "Order History"
                ? "bg-cyan-700/20 rounded-xl "
                : "text-zinc-700"
            }`}
            onClick={() => setActiveTab("Order History")}
          >
            <FontAwesomeIcon
              icon={faArchive}
              className="mr-1 sm:mr-2 text-sm sm:text-base text-zinc-500"
            />{" "}
            Order History
          </button>
        </div>
      </>
    </div>
  );
}
