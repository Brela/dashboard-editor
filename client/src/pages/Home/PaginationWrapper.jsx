import React from "react";

export default function PaginationWrapper({ children }) {
  return (
    <section className=" absolute bottom-10 bg-white left-0 border-b border-l border-r rounded-b-md border-gray-300 px-7 py-2 w-full">
      {children}
    </section>
  );
}
