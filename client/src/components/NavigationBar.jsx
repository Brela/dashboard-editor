import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive,
  faBox,
  faShoppingCart,
  faTable,
} from "@fortawesome/free-solid-svg-icons";

const buttons = [
  { label: "Inventory", icon: faBox, value: "inventory" },
  { label: "Active Orders", icon: faShoppingCart, value: "Active Orders" },
  { label: "Order History", icon: faArchive, value: "Order History" },
];

export default function NavigationBar({ activeTab, setActiveTab }) {
  return (
    <div>
      <div className="flex mt-4  mb-2 gap-x-4 sm:gap-x-1 font-semibold text-zinc-800 md:px-2">
        {buttons.map((button) => (
          <button
            key={button.value}
            className={`w-1/3 sm:w-auto flex flex-col items-center sm:flex-row gap-1 sm:gap-0 px-1 sm:px-4 py-1  ${
              activeTab === button.value
                ? " text-cyan-800 text-md rounded-md "
                : "text-zinc-500 text-md"
            }`}
            onClick={() => setActiveTab(button.value)}
          >
            <FontAwesomeIcon
              icon={button.icon}
              className="mr-1 sm:mr-2 text-xs sm:text-base text-zinc-500"
            />{" "}
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
