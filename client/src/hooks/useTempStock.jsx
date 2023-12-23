import { useEffect } from "react";
import { toast } from "react-hot-toast";

export const useTempInStock = (
  inventory,
  isUsingStock,
  setIsUsingStock,
  tempInStock,
  setTempInStock,
  useSelectedOnlyOn,
  selectedItems
) => {
  selectedItems = Array.from(selectedItems); // Ensure selectedItems is an array

  useEffect(() => {
    if (!Array.isArray(inventory)) {
      console.warn("inventory is not an array:", inventory);
      return;
    }
    const inStockData = {};
    inventory?.forEach((item) => {
      inStockData[item.id] = item.inStock;
    });
    setTempInStock(inStockData);
  }, [inventory]);

  useEffect(() => {
    let intervalId = null;
    if (
      isUsingStock === true &&
      Array.isArray(selectedItems) &&
      selectedItems.length > 0
    ) {
      decreaseStock();
    } else {
      if (selectedItems.length <= 0 && isUsingStock) {
        setIsUsingStock(false);
        toast.error(
          "Must select one or more rows to use inventory with demo controls."
        );
        return;
      }
    }
    function decreaseStock() {
      intervalId = setInterval(() => {
        setTempInStock((prevInStock) => {
          const updatedInStock = {};
          inventory?.forEach((item) => {
            if (
              selectedItems.some((selectedItem) => selectedItem.id === item.id)
            ) {
              updatedInStock[item.id] =
                prevInStock[item.id] > 0 ? prevInStock[item.id] - 1 : 0;
            } else {
              updatedInStock[item.id] = prevInStock[item.id];
            }
          });
          return updatedInStock;
        });
      }, 2000);
    }

    return () => clearInterval(intervalId);
  }, [inventory, isUsingStock, useSelectedOnlyOn]);

  return [setTempInStock];
};
