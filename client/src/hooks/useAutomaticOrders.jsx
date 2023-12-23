import { useEffect } from "react";
import calculateTotal from "../utils/calcShippingAndTotal";
import { toast } from "react-hot-toast";

const handleCalculateTotals = (orderQty, unitPrice) => {
  const qty = parseFloat(orderQty);
  const price = parseFloat(unitPrice);

  if (isNaN(qty) || isNaN(price)) {
    return 0;
  } else {
    const { total } = calculateTotal(qty, price);
    return total;
  }
};

export const useAutomaticOrders = (
  inventory,
  isUsingStock,
  tempInStock,
  createOrderItem,
  reloadOrders,
  selectedItems, // only place order for selected items
  setOrderedDeliveryPopupContent,
  setDisplayOrderedDeliveredPopup,
) => {
  useEffect(() => {
    if (!Array.isArray(inventory)) return;

    // Check inventory for items that need to be re-ordered
    inventory.forEach((item) => {
      const totalCost = handleCalculateTotals(item.orderQty, item.unitPrice);
      // console.log(tempInStock[item.id], item.reorderAt);

      if (
        tempInStock[item.id] === item.reorderAt &&
        // add this for also triggering orders at 80% of stock
        // || tempInStock[item.id] === item.reorderAt * 0.8) &&
        selectedItems.some((sel) => sel.id === item.id) &&
        isUsingStock &&
        item.reorderAt != 0
      ) {
        // Create order item
        const orderInfo = {
          sku: item.sku,
          orderQty: item.orderQty,
          totalCost: totalCost,
        };

        // Make API call to create order item
        createOrderItem(orderInfo)
          .then(() => {
            reloadOrders();
            // need to remove order delivered pop up and use context to display values in toast
            // toast.success(`Order created for ${product.productName} with SKU: ${orderInfo.sku}, Quantity: ${item.orderQty}, and Total Cost: ${totalCost}`);
            setOrderedDeliveryPopupContent(["o", item, orderInfo]);
            setDisplayOrderedDeliveredPopup(true);

            // reloading inventory here will cause tempStock values to be lost unless we send update req first
          })
          .catch((error) => {
            console.error("Error creating order item:", error);
          });
      }
    });
  }, [tempInStock, isUsingStock]);
};
