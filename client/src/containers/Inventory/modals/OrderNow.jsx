import React, { useState, useEffect, useContext } from "react";
import { OrdersContext } from "../../../contexts/orders.context";
import { createOrderItem } from "../../../services/ordersAPIcalls";
import calculateTotal from "../../../utils/calcShippingAndTotal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { InventoryContext } from "../../../contexts/inventory.context";

export default function Order({ handleClosePopup, popup, item, reloadOrders }) {
  const [orderQty, setOrderQty] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const { setNeedStatsUpdate} = useContext(InventoryContext)
  const { setDisplayOrderedDeliveredPopup, setOrderedDeliveryPopupContent } =
    useContext(OrdersContext);

  useEffect(() => {
    setOrderQty(item.orderQty);
  }, [item]);

  const handleCalculateTotals = () => {
    const qty = parseFloat(orderQty);
    const price = parseFloat(item.unitPrice);

    if (isNaN(qty) || isNaN(price)) {
      setShippingCost(0);
      setTotalCost(0);
    } else {
      const { ship, total } = calculateTotal(orderQty, item.unitPrice);
      setShippingCost(ship);
      setTotalCost(total);
    }
  };

  const handleQtyChange = (event) => {
    const newQty = Number(event.target.value);
    setOrderQty(newQty);
  };

  useEffect(() => {
    handleCalculateTotals();
  }, [orderQty]);

  useEffect(() => {
    handleCalculateTotals(orderQty);
  }, [item]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    const orderInfo = {
      sku: item.sku,
      orderQty,
      totalCost,
    };

    const toastId = toast.loading("Please wait while we process your order.");

    try {
      const response = await createOrderItem(orderInfo);

      setData(response);
      setIsError(false);
      reloadOrders();
      setNeedStatsUpdate(true);
      // setOrderedDeliveryPopupContent(["o", item, orderInfo]);
      // setDisplayOrderedDeliveredPopup(true);
      handleClosePopup(e);

      toast.dismiss(toastId);
      toast.success("Order processed successfully.");
    } catch (error) {
      console.error(error);
      setIsError(true);

      toast.dismiss(toastId);
      toast.error("Unable to place your order. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-zinc-50 rounded-2xl drop-shadow-lg w-80">
        <button
          onClick={handleClosePopup}
          className={`absolute top-3 right-3 p-2 rounded-full text-xl transition ${
            popup === "close" ? "hidden" : "block"
          }`}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-zinc-500 hover:text-zinc-400"
          />
        </button>
        <div className="grid grid-cols-2 gap-4 p-6">
          <span className="font-semibold">SKU</span>
          <span>{item.sku}</span>

          <span className="font-semibold">Brand</span>
          <span>{item.brand}</span>

          <span className="font-semibold">Name</span>
          <span>{item.productName}</span>

          <span className="font-semibold">Shipper</span>
          <span>{item.shipper}</span>

          <span className="font-semibold">Cost</span>
          <span>{item.unitPrice}</span>

          <span className="font-semibold">Qty</span>
          <input
            className="border-2 border-zinc-200 rounded-lg bg-transparent px-2 py-1 w-full outline-emerald-400"
            id="order-qty"
            type="text"
            defaultValue={item.orderQty}
            onChange={handleQtyChange}
          />

          <span className="font-semibold">Shipping</span>
          <span>{`$${shippingCost}`}</span>

          <span className="font-semibold">Total</span>
          <span>{`$${totalCost}`}</span>

          <div className="col-span-2">
            <button
              className="bg-emerald-400/70 hover:bg-emerald-400 text-emerald-800 font-bold px-4 py-2 rounded-lg text-sm w-full"
              onClick={handleCreateOrder}
            >
              <FontAwesomeIcon icon={faCartShopping} className="mr-1" /> Order
              Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
