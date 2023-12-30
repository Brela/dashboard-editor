import React from "react";

const EmptyDashboard = ({ message }) => {
  return (
    <section className="block w-full">
      <div
        className=" mx-auto  mt-4 border rounded-md w-[90vw] lg:w-[80vw] h-[70vh] flex justify-center items-center px-10 text-center"
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
