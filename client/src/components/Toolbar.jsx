import React from "react";
import { twMerge } from "tailwind-merge";

const Toolbar = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "mb-5 mt-1 flex justify-between items-center mx-4 bg-slate-100 rounded-full overflow-x-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Toolbar;
