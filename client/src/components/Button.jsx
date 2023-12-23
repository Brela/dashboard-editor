import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "./index";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

let PRIMARY_COLOR = "#FF0000";

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
        return "px-1.5 py-0.5 text-xs";
      case "sm":
        return "px-2 py-1 text-sm";
      case "md":
        return "px-3 py-2 text-sm";
      case "lg":
        return "px-4 py-2 text-base";
      case "xl":
        return "px-5 py-3 text-lg";
      default:
        return "px-3 py-2 text-sm";
    }
  };

  const buttonClass = twMerge(
    `transition rounded font-semibold cursor-pointer hover:bg-opacity-75 focus-visible:outline-0 ${getVariantClass()} ${getSizeClass()} ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`,
    className,
  );

  return variant === "primary" || !variant ? (
    <button
      type={type}
      style={{
        backgroundColor:
          mode === "solid" && hover
            ? PRIMARY_COLOR + "90"
            : mode === "outlined"
            ? hover
              ? PRIMARY_COLOR
              : ""
            : PRIMARY_COLOR,
        opacity: isLoading || disabled ? 0.5 : 1,
        border: mode === "solid" ? "" : `1px solid ${PRIMARY_COLOR}`,
        color: mode === "solid" || hover ? "white" : PRIMARY_COLOR,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
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
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner size="sm" className="" />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </div>
      ) : (
        children
      )}
    </button>
  ) : (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      aria-pressed={active}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner size="sm" className="" />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </div>
      ) : (
        children
      )}
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
