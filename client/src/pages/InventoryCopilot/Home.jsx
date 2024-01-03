import React, { useState, useRef } from "react";
import Profile from "../../containers/Profile/index.jsx";
import Footer from "../../containers/Footer/Footer.jsx";
import NavigationBar from "./NavigationBar.jsx";

import OrderHistory from "../../containers/Orders/OrderHistory.jsx";
import ActiveOrders from "../../containers/Orders/ActiveOrders.jsx";
import Inventory from "../../containers/Inventory/Inventory.jsx";
import PaginationWrapper from "./PaginationWrapper.jsx";
import DemoControls from "../../containers/DemoControls.jsx";
import { twMerge } from "tailwind-merge";
import { dashboardBg, headerBg } from "../../css/globalTailwindVars.js";

function InventoryPage() {
  const inventoryListScrollRef = useRef(null);
  const ordersListScrollRef = useRef(null);
  const [rowHeightState, setRowHeightState] = useState(null);
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    // <div className="flex flex-col 2xl:items-center">
    <div className="">
      {/* <div className=" max-w-screen-2xl mx-2 md:mx-4 mb-2 md:mb-3 px-2 md:px-6 flex gap-2 flex-col rounded-3xl"> */}
      <section
        className={twMerge("w-full rounded-b-md px-4 border-b bg-white")}
      >
        <div className="flex items-center justify-between ">
          <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />

          <Profile />
        </div>
      </section>
      <section
        className={twMerge(
          " relative min-h-[84vh] p-2 md:p-4 max-w-[1700px] mx-auto",
        )}
      >
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
      <DemoControls />
      <div className=" flex justify-center  my-4">
        <Footer />
      </div>
    </div>
  );
}

export default InventoryPage;
