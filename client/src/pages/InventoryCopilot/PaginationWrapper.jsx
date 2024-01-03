import React from "react";

export default function PaginationWrapper({ children }) {
  return (
    <section className=" absolute bottom-10 left-0 bg-gray-100 rounded-lg border-gray-300 px-7 w-full">
      <div className="border-none bg-transparent">{children}</div>
    </section>
  );
}
