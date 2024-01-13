import React from "react";
import Header from "./containers/Header";
import { Route, Routes } from "react-router-dom";
import DashboardEditor from "./containers/Dashboard/DashboardEditor/DashEditor";
import DashboardHome from "./containers/Dashboard/DashHome";

const Routing = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/*" element={<DashboardHome />} />
        <Route path="/editor" element={<DashboardEditor />} />
      </Routes>
    </div>
  );
};

export default Routing;
