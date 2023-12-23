import React from "react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

const ChartWrapper = ({ title, className, titleClassName, children }) => {
  // no width on ChartWrapper for now - best used in grid like this: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 h-full items-stretch pb-2 my-6">
  return (
    <>
      <div
        className={twMerge(
          `flex flex-col gap-1 min-h-[250px] min-w-content`,
          className
        )}
      >
        <h3
          className={twMerge(
            "font-bold text-lg text-gray-900 pb-1",
            titleClassName
          )}
        >
          {title || "\u00A0"}
        </h3>

        <div className="p-4 border border-gray-200 rounded-md shadow-sm flex flex-col justify-center gap-2 h-full">
          {children}
        </div>
      </div>
    </>
  );
};

ChartWrapper.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ChartWrapper;
