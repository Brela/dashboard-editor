import React, { useContext } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { OrdersContext } from "./contexts/orders.context.jsx";
import { AuthContext } from "./contexts/auth.context.jsx";
import { DashboardProvider } from "./contexts/dash.context.jsx";
import Home from "./pages/Home/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderedDeliveredPopup from "./containers/Inventory/modals/OrderedDeliveredPopup.jsx";
import Dashboard from "./containers/Dashboard";
import DashboardEditor from "./containers/Dashboard/DashboardEditor/index.jsx";
import { Toaster } from "react-hot-toast";
import Profile from "./containers/Profile/index.jsx";

export default function DashboardEditorRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <DashboardProvider>
      <>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route
                path="/"
                element={
                  <div>
                    <Profile />
                    <Dashboard />
                  </div>
                }
              />
              <Route path="/editor" element={<DashboardEditor />} />
              <Route path="/*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="login" element={<LoginPage project="dashboard" />} />
              <Route path="/*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </>
    </DashboardProvider>
  );
}
