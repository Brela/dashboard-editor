import React, { useContext } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { OrdersContext } from "./contexts/orders.context.jsx";
import { AuthContext } from "./contexts/auth.context.jsx";
import Home from "./pages/Home/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderedDeliveredPopup from "./containers/Inventory/modals/OrderedDeliveredPopup.jsx";
import DashboardEditor from "./containers/Dashboard/DashboardEditor/index.jsx";
import { Toaster } from "react-hot-toast";

export default function AppRouterContent() {
  const { isLoggedIn } = useContext(AuthContext);
  const { displayOrderedDeliveredPopup } = useContext(OrdersContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isDemo = params.get("demo") === "true";

  return (
    <>
      {displayOrderedDeliveredPopup && <OrderedDeliveredPopup />}
      {isLoggedIn ? (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard-editor" element={<DashboardEditor />} />

            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
          {location.pathname === "/orders" ||
            location.pathname === "/" ||
            isDemo}
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#FFF",
            borderRadius: "9999px",
            color: "#333",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}
