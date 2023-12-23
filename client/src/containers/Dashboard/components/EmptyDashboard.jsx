import React from "react";

const EmptyDashboard = ({ message }) => {
  return (
    <section className="flex justify-center">
      <div
        className="mt-4 border rounded-md w-[90%] lg:w-[96%] h-[60vh] flex justify-center items-center px-10 text-center"
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
