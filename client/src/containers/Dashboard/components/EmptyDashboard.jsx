import React from "react";
import { twMerge } from "tailwind-merge";

const EmptyDashboard = ({ message, className }) => {
  return (
    <section className="block w-full">
      <div
        className={twMerge(
          " mx-auto  mt-4 border rounded-md w-[90vw] lg:w-[80vw] h-[70vh] flex justify-center items-center px-10 text-center",
          className,
        )}
        style={{
          border: "1px dashed",
          borderWidth: "1px",
          borderColor: "#b5b5b5",
        }}
      >
        {message}
      </div>
    </section>
  );
};

export default EmptyDashboard;
