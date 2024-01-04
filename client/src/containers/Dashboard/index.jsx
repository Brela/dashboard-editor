import React from "react";
import DashboardHeader from "./DashboardHeader/DashHeader";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardEditor from "./DashboardEditor/DashEditor";
import DashboardHome from "./DashHome";

const DashboardHeaderRouting = () => {
  return (
    <div>
      <DashboardHeader />
      <Routes>
        <Route path="/*" element={<DashboardHome />} />
        <Route path="/editor" element={<DashboardEditor />} />
      </Routes>
    </div>
  );
};

export default DashboardHeaderRouting;
