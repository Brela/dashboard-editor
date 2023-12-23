import React, { useState, useRef } from "react";
import Header from "../../containers/Header/Header.jsx";
import Footer from "../../containers/Footer/Footer.jsx";
import NavigationBar from "../../components/NavigationBar.jsx";
import Dashboard from "../../containers/Dashboard";
import OrderHistory from "../../containers/Orders/OrderHistory.jsx";
import ActiveOrders from "../../containers/Orders/ActiveOrders.jsx";
import Inventory from "../../containers/Inventory/Inventory.jsx";
import PaginationWrapper from "./PaginationWrapper.jsx";
import DemoControls from "../../containers/DemoControls.jsx";

function InventoryPage() {
  const inventoryListScrollRef = useRef(null);
  const ordersListScrollRef = useRef(null);
  const [rowHeightState, setRowHeightState] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className=" max-w-screen-2xl mx-auto ">
      <div className=" max-w-screen-2xl mx-2 md:mx-4 mb-2 md:mb-3 px-2 md:px-6 flex gap-2 flex-col rounded-3xl">
        <Header />
        <section className="relative bg-zinc-50 rounded-2xl p-2 md:p-4 overflow-x-auto min-h-[85vh]">
          <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "inventory" && <Inventory />}
          {activeTab === "Active Orders" && <ActiveOrders />}
          {activeTab === "Order History" && <OrderHistory />}
          {/*     <InventoryContent
            inventoryListScrollRef={inventoryListScrollRef}
            ordersListScrollRef={ordersListScrollRef}
            rowHeightState={rowHeightState}
          /> */}

          <PaginationWrapper activeTab={activeTab} />
        </section>
        {/* <Stats /> */}
        <DemoControls />
        <div className=" flex justify-center  my-4">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
