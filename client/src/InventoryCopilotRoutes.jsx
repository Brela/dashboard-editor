import React, { useContext } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { OrdersContext } from "./contexts/orders.context.jsx";
import { AuthContext } from "./contexts/auth.context.jsx";
import Home from "./pages/Home/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderedDeliveredPopup from "./containers/Inventory/modals/OrderedDeliveredPopup.jsx";
import DashboardEditor from "./containers/Dashboard/DashboardEditor/index.jsx";
import { Toaster } from "react-hot-toast";
import { InventoryProvider } from "./contexts/inventory.context.jsx";
import { OrdersProvider } from "./contexts/orders.context.jsx";

export default function AppRouterContent() {
  const { displayOrderedDeliveredPopup } = useContext(OrdersContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isDemo = params.get("demo") === "true";

  return (
    <>
      <InventoryProvider>
        <OrdersProvider>
          {displayOrderedDeliveredPopup && <OrderedDeliveredPopup />}

          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/*" element={<Navigate to="/copilot" />} />
            </Routes>
          </>
        </OrdersProvider>
      </InventoryProvider>
    </>
  );
}
