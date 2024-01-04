import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardEditor from "./DashboardEditor/DashEditor";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/editor" element={<DashboardEditor />} />
      <Route path="/*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default DashboardRoutes;
