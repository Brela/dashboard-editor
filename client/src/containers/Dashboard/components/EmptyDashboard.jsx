import React from "react";

const EmptyDashboard = () => {
  return (
    <section className="flex justify-center">
      <div
        className="mt-4 border rounded-md w-[90%] lg:w-[96%] h-[75vh] flex justify-center items-center px-10 text-center"
        style={{
          border: "1px dashed",
          borderWidth: "1px",
          borderColor: "#b5b5b5",
        }}
      >
        You don't have any widgets on this dashboard! Click dashboard settings
        above to add some widgets.
      </div>
    </section>
  );
};

export default EmptyDashboard;
