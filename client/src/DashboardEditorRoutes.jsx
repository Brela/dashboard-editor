import React, { useContext } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { OrdersContext } from "./contexts/orders.context.jsx";
import { AuthContext } from "./contexts/auth.context.jsx";
import Home from "./pages/Home/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderedDeliveredPopup from "./containers/Inventory/modals/OrderedDeliveredPopup.jsx";
import Dashboard from "./containers/Dashboard/DashHome.jsx";
import DashboardEditor from "./containers/Dashboard/DashboardEditor/DashEditor.jsx";
import { Toaster } from "react-hot-toast";
import Profile from "./containers/Profile/index.jsx";
import { DashboardProvider } from "./contexts/dash.context.jsx";
import DashboardHeaderRouting from "./containers/Dashboard/index.jsx";

export default function DashboardEditorRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <DashboardProvider>
      <>
        <Routes>
          {isLoggedIn ? (
            <DashboardHeaderRouting />
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
