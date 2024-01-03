import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive,
  faBox,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import useWindowSize from "../../hooks/useWindowSize";
import { Popover } from "../../components";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { startCase } from "lodash";

const buttons = [
  { label: "Inventory", icon: faBox, value: "inventory" },
  { label: "Active Orders", icon: faShoppingCart, value: "Active Orders" },
  { label: "Order History", icon: faArchive, value: "Order History" },
];

export default function NavigationBar({ activeTab, setActiveTab }) {
  const isWindowSmall = useWindowSize(1460);

  const DesktopNav = (
    <div>
      <div className="flex mt-4  mb-2 gap-x-4 sm:gap-x-1 font-semibold text-zinc-800 md:px-2">
        {buttons.map((button) => (
          <button
            key={button.value}
            className={`w-1/3 hover:text-gray-400 sm:w-auto flex flex-col items-center sm:flex-row gap-1 sm:gap-0 px-1 sm:px-4 py-1  ${
              activeTab === button.value
                ? "font-bold text-md rounded-md text-cyan-800"
                : "text-gray-500 text-md"
            }`}
            onClick={() => setActiveTab(button.value)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );

  const MobileNav = (
    <Popover
      trigger={
        <div className=" hover:bg-slate-200/80 p-3 rounded-md  focus:outline-none focus:bg-slate-400 flex items-center justify-center">
          <Bars3Icon className="w-7 h-7 mr-4" />
          {startCase(activeTab)}
        </div>
      }
      contentClassName="mr-2 px-8"
      content={
        <ul className="flex flex-col gap-3">
          {buttons.map((button) => (
            <Popover.CloseOnClickItem
              key={button.value}
              onClick={() => setActiveTab(button.value)}
              className={"hover:text-gray-400 w-full"}
            >
              {button.label}
            </Popover.CloseOnClickItem>
          ))}
        </ul>
      }
    />
  );

  return isWindowSmall ? MobileNav : DesktopNav;
}
