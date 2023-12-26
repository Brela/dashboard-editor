import React from "react";

export default function PaginationWrapper({ children }) {
  return (
    <section className=" bg-slate-300/10 absolute bottom-0 left-0 border-b border-l border-r rounded-b-md border-gray-300 px-7 pb-2 w-full">
      {children}
    </section>
  );
}
