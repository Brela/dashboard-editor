import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { twMerge } from "tailwind-merge";

const ToolbarButton = ({
  onClick,
  icon,
  iconPosition = "left",
  text,
  className,
}) => {
  return (
    <button
      // Adjust the number according to the number of columns
      className={twMerge(
        "ml-4 hover:bg-zinc-200/70 py-1 px-4 rounded-md flex items-center gap-2 font-medium whitespace-nowrap",
        className,
      )}
      onClick={onClick}
    >
      {iconPosition === "left" && (
        <FontAwesomeIcon icon={icon} className="text-sm text-zinc-400" />
      )}
      <span className=" text-md ">{text}</span>
      {iconPosition === "right" && (
        <FontAwesomeIcon icon={icon} className="text-sm text-zinc-400" />
      )}
    </button>
  );
};

export default ToolbarButton;
