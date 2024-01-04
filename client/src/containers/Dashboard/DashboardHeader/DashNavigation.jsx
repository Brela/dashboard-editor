import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { faBox, faTable } from "@fortawesome/free-solid-svg-icons";
import useWindowSize from "../../../hooks/useWindowSize.js";
import { twMerge } from "tailwind-merge";
import { DashboardContext } from "../../../contexts/dash.context.jsx";
import ConfirmUnsavedChanges from "../DashboardEditor/dashboardModals/ConfirmUnsavedChanges.jsx";
import Popover from "../../../components/Popover.jsx";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { startCase } from "lodash";

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
  const isWindowSmall = useWindowSize(1530);

  const navigate = useNavigate();

  const pathSegments = currentPath.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const isActive =
    lastSegment === button.value ||
    (pathSegments.length === 0 && button.value === "dashboard");

  return (
    <button
      key={button.value}
      className={twMerge(
        "w-1/3 sm:w-auto  flex flex-col items-center sm:flex-row gap-1 sm:gap-0 px-1 sm:px-4 py-1",
        isActive
          ? "text-cyan-800 text-md "
          : "text-zinc-500 hover:text-zinc-500/70 text-md",
        pathSegments.includes("editor") && isWindowSmall ? "text-white" : "",
      )}
      onClick={() => {
        if (hasUnsavedChanges && button.value === "dashboard") {
          setOpenConfirmUnsavedModal(true);
        } else {
          navigate(button.href);
        }
      }}
    >
      <FontAwesomeIcon
        icon={button.icon}
        className="mr-1 sm:mr-2 text-xs sm:text-base text-zinc-400 fa-lg"
      />
      {button.label}
    </button>
  );
};

export default function DashNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWindowSmall = useWindowSize(1530);
  const { hasUnsavedChanges, setOpenConfirmUnsavedModal } =
    useContext(DashboardContext);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  const DesktopNav = (
    <div className="flex mt-4 mb-2 gap-x-4 sm:gap-x-1 font-semibold text-zinc-800 md:px-2">
      {buttons.map((button) => (
        <NavButton
          key={button.value}
          currentPath={location.pathname}
          button={button}
        />
      ))}
    </div>
  );

  const MobileNav = (
    <Popover
      trigger={
        <div className="hover:bg-slate-200/80 p-3 rounded-md focus:outline-none focus:bg-slate-400 flex items-center justify-center">
          <Bars3Icon className="w-7 h-7" />
        </div>
      }
      contentClassName="mr-2 px-8"
      content={
        <ul className="flex flex-col gap-3">
          {buttons.map((button) => {
            const isActive =
              lastSegment === button.value ||
              (pathSegments.length === 0 && button.value === "dashboard");

            return (
              <li
                key={button.value}
                onClick={() => {
                  if (hasUnsavedChanges && button.value === "dashboard") {
                    setOpenConfirmUnsavedModal(true);
                  } else {
                    navigate(button.href);
                  }
                }}
                className={twMerge(
                  " hover:cursor-pointer w-full",
                  isActive ? "text-cyan-700" : "hover:text-gray-400",
                )}
              >
                {button.label}
              </li>
            );
          })}
        </ul>
      }
    />
  );

  return isWindowSmall ? MobileNav : DesktopNav;
}
