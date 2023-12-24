import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "./index";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { primaryColor } from "../css/globalTailwindVars";

function Button({
  children,
  variant,
  size,
  className,
  type,
  isLoading,
  active,
  disabled,
  loadingText,
  mode = "solid",
  onClick,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return mode === "solid"
          ? "bg-gray-600 text-white"
          : "border-gray-600 border text-gray-600 hover:bg-gray-600 hover:text-white";
      case "success":
        return mode === "solid"
          ? "bg-green-600 text-white"
          : "border-green-600 border text-green-600 hover:bg-green-600 hover:text-white";
      case "danger":
        return mode === "solid"
          ? "bg-red-600 text-white"
          : "border-red-600 border text-red-600 hover:bg-red-600 hover:text-white";
      case "warning":
        return mode === "solid"
          ? "bg-yellow-600 text-white"
          : "border-yellow-600 border text-yellow-600 hover:bg-yellow-600 hover:text-white";
      case "info":
        return mode === "solid"
          ? "bg-blue-600 text-white"
          : "border-blue-600 border text-blue-600 hover:bg-blue-600 hover:text-white";
      case "light":
        return mode === "solid"
          ? "bg-gray-200 text-gray-800 hover:opacity-75"
          : "border-gray-200 border text-gray-800 hover:bg-gray-200 hover:text-gray-800";
      case "dark":
        return mode === "solid"
          ? "bg-gray-800 text-white"
          : "border-gray-800 border text-gray-800 hover:bg-gray-800 hover:text-white";
      case "ghost":
        return mode === "solid"
          ? "hover:bg-slate-200 text-gray-500"
          : "border-gray-200 border text-gray-500 hover:bg-slate-200 hover:text-gray-800";
      case "link":
        return mode === "solid"
          ? "text-blue-600 underline hover:bg-slate-200"
          : "border-gray-200 border text-blue-600 underline hover:bg-slate-200";
      default:
        return "text-white";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "xs":
        return "text-xs";
      case "sm":
        return "text-sm";
      case "md":
        return "text-sm";
      case "lg":
        return "text-base";
      case "xl":
        return "text-lg";
      default:
        return "text-sm";
    }
  };

  const buttonClass = twMerge(
    `transition rounded font-semibold cursor-pointer hover:bg-opacity-75 focus-visible:outline-0 ${getVariantClass()} ${getSizeClass()} ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    } p-2 px-3`,
    className,
  );

  const buttonStyle =
    variant === "primary" || !variant
      ? {
          backgroundColor:
            mode === "solid" && hover
              ? primaryColor + "90"
              : mode === "outlined"
              ? hover
                ? primaryColor
                : ""
              : primaryColor,
          opacity: isLoading || disabled ? 0.5 : 1,
          border: mode === "solid" ? "" : `1px solid ${primaryColor}`,
          color: mode === "solid" || hover ? "white" : primaryColor,
          cursor: disabled ? "not-allowed" : "pointer",
        }
      : {
          cursor: disabled ? "not-allowed" : "pointer",
        };

  return (
    <button
      type={type}
      style={buttonStyle}
      className={buttonClass}
      disabled={disabled}
      aria-pressed={active}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onClick={onClick}
      {...rest}
    >
      <div className="relative flex items-center justify-center space-x-2">
        {isLoading && (
          <div className="absolute flex items-center space-x-2">
            <Spinner size="medium" />
            <span>{loadingText}</span>
          </div>
        )}
        <span className={isLoading ? "invisible" : ""}>{children}</span>
      </div>
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
    "ghost",
    "link",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "reset", "submit"]),
  isLoading: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  mode: PropTypes.oneOf(["solid", "outlined"]),
  onClick: PropTypes.func,
};

Button.defaultProps = {
  variant: "primary",
  size: "md",
  className: "",
  type: "button",
  isLoading: false,
  active: false,
  disabled: false,
};

export default Button;
