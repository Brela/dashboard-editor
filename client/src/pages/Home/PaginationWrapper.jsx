import React from "react";

export default function PaginationWrapper({ children }) {
  return (
    <section className="absolute bottom-0 left-0 px-7 w-full">
      {children}
    </section>
  );
}
