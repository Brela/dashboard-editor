import React, { useContext } from "react";
import { handleOrderDelivery } from "../../utils/orderHelpers";
import { InventoryContext } from "../../contexts/inventory.context";
import { OrdersContext } from "../../contexts/orders.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-hot-toast';


function EditPopup({ handleClosePopup, order }) {
  const { setTempInStock, setNeedStatsUpdate } = useContext(InventoryContext);
  const {
    reloadOrders,
    setDisplayOrderedDeliveredPopup,
    setOrderedDeliveryPopupContent,
  } = useContext(OrdersContext);

  const handleDelivery = async (order) => {
    try {
        await handleOrderDelivery(
            order,
            setTempInStock,
            setDisplayOrderedDeliveredPopup,
            setOrderedDeliveryPopupContent
        );
        toast.success("Order successfully delivered!"); 
        handleClosePopup();
        reloadOrders();
        setNeedStatsUpdate(true);
    } catch (error) {
        toast.error("Error delivering the order. Please try again."); 
    }
};

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg drop-shadow-xl space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">SKU</h2>
          <div className="text-gray-700">{order.product.sku}</div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Order ID</h2>
          <div className="text-gray-700">{order.id}</div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-emerald-400/80 text-emerald-800 font-bold px-4 py-2 rounded hover:bg-emerald-400"
            onClick={() => handleDelivery(order)}
          >
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="mr-1 text-emerald-600/90"
            />{" "}
            Delivered
          </button>
          <button
            className="bg-gray-300 text-black/80 font-bold px-4 py-2 rounded hover:bg-gray-400/70"
            onClick={handleClosePopup}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPopup;
