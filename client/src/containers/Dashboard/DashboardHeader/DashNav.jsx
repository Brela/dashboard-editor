import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import {
  faArchive,
  faBox,
  faShoppingCart,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import useWindowSize from "../../../hooks/useWindowSize.js";
import { twMerge } from "tailwind-merge";
import { DashboardContext } from "../../../contexts/dash.context.jsx";
import ConfirmUnsavedChanges from "../DashboardEditor/dashboardModals/ConfirmUnsavedChanges.jsx";

const buttons = [
  { label: "Dashboard", icon: faBox, value: "dashboard", href: `/dashboard` },
  {
    label: "Dashboard Editor",
    icon: faTable,
    value: "editor",
    href: `/dashboard/editor`,
  },
];

const NavButton = ({ currentPath, button }) => {
  const { hasUnsavedChanges, setOpenConfirmUnsavedModal } =
    useContext(DashboardContext);
  const isWindowSmall = useWindowSize(1460);

  const navigate = useNavigate();
  const pathSegments = currentPath.split("/").filter(Boolean); // filter out empty strings
  const lastSegment = pathSegments[pathSegments.length - 1];
  const isActive =
    lastSegment === button.value ||
    (pathSegments.length === 0 && button.value === "dashboard");

  return (
    <button
      key={button.value}
      className={twMerge(
        "w-1/3 sm:w-auto hover:text-cyan-700/70 flex flex-col items-center sm:flex-row gap-1 sm:gap-0 px-1 sm:px-4 py-1",
        isActive ? "text-cyan-800  text-md " : "text-zinc-500 text-md",
        pathSegments.includes("editor") && isWindowSmall ? "text-white" : "",
      )}
      onClick={() => {
        console.log("------5-5-5:", hasUnsavedChanges);
        if (hasUnsavedChanges && button.value === "dashboard") {
          setOpenConfirmUnsavedModal(true);
        } else {
          navigate(button.href);
        }
      }}
    >
      <FontAwesomeIcon
        icon={button.icon}
        className="mr-1 sm:mr-2 text-xs sm:text-base text-zinc-300 fa-lg"
      />
      {button.label}
    </button>
  );
};

export default function DashNavBar() {
  const location = useLocation();

  return (
    <div>
      <div
        className={
          "flex mt-4  mb-2 gap-x-4 sm:gap-x-1 font-semibold text-zinc-800 md:px-2"
        }
      >
        {buttons.map((button) => (
          <NavButton
            key={button.value}
            currentPath={location.pathname}
            button={button}
          />
        ))}
      </div>
    </div>
  );
}
