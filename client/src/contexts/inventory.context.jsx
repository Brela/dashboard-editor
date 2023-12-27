import { createContext, useContext, useState, useEffect } from "react";
import { getInventoryList } from "../services/inventoryAPIcalls";
import { useTempInStock } from "../hooks/useTempStock";

import { AuthContext } from "./auth.context";

export const InventoryContext = createContext({
  userData: {},
  inventory: [],
  reloadInventory: () => {},
  startUsage: () => {},
  stopUsage: () => {},
  resetInventory: () => {},
  useSelectedOnlyOn: false,
  setUseSelectedOnlyOn: () => {},
  isUsingStock: false,
  tempInStock: {},
  setTempInStock: () => {},
  selectedItems: [],
  setSelectedItems: () => {},
  toggleSelectedItem: () => {},
  isLoading: false,
  needStatsUpdate: false,
  setNeedStatsUpdate: () => {},
});

export const InventoryProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [inventory, setInventory] = useState([]);
  const [isUsingStock, setIsUsingStock] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempInStock, setTempInStock] = useState({});
  // this is for demo controls to set the "Use Selected (products) Only" on or off
  const [useSelectedOnlyOn, setUseSelectedOnlyOn] = useState(false);

  const { isLoggedIn, userId } = useContext(AuthContext);
  const [needStatsUpdate, setNeedStatsUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventoryList();
        setInventory(inventoryData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const reloadInventory = async (newInventory) => {
    setIsLoading(true);

    if (newInventory) {
      setInventory(newInventory);
    } else {
      try {
        const data = await getInventoryList();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory list:", error);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    reloadInventory();
  }, [isLoggedIn, userId]);

  // call the tempInStock hook that takes care of decreasing the inventory
  useTempInStock(
    inventory,
    isUsingStock,
    setIsUsingStock,
    tempInStock,
    setTempInStock,
    useSelectedOnlyOn,
    selectedItems,
  );

  // -----------------------  toggle selected items ---------------------
  const getInventoryIndex = (itemId) => {
    return inventory.findIndex((item) => item.id === itemId);
  };

  const toggleSelectedItem = async (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      const prevSelectedItemsArray = Array.from(prevSelectedItems);
      // Check if the item is already selected
      const itemIndexInSelected = prevSelectedItemsArray.indexOf(itemId);
      if (itemIndexInSelected !== -1) {
        // Remove the item from the selected items array
        console.log(
          "1) prevSelectedItemsArray before removing:  ",
          prevSelectedItemsArray,
        );
        prevSelectedItemsArray.splice(itemIndexInSelected, 1);
        console.log(
          "2) prevSelectedItemsArray after removing:  ",
          prevSelectedItemsArray,
        );
      } else {
        // Add the item to the selected items array in the correct order based on the inventory
        const inventoryIndex = getInventoryIndex(itemId);
        const insertIndex = prevSelectedItemsArray.findIndex(
          (selectedItemId) =>
            inventoryIndex < getInventoryIndex(selectedItemId),
        );
        if (insertIndex !== -1) {
          prevSelectedItemsArray.splice(insertIndex, 0, itemId);
        } else {
          prevSelectedItemsArray.push(itemId);
        }
      }
      // Filter out invalid item IDs
      const validSelectedItemsArray = prevSelectedItemsArray.filter(
        (selectedItemId) =>
          inventory.some((item) => item.id === selectedItemId),
      );

      // return the array
      return prevSelectedItemsArray;
    });
  };

  // --------------------- demo controls -------------------

  const startUsage = () => {
    setIsUsingStock(true);
  };

  const stopUsage = () => {
    setIsUsingStock(false);
  };

  const resetInventory = () => {
    reloadInventory();
  };
  // -----------------------------------

  const value = {
    userData,
    inventory,
    reloadInventory,
    startUsage,
    stopUsage,
    resetInventory,
    useSelectedOnlyOn,
    setUseSelectedOnlyOn,
    isUsingStock,
    tempInStock,
    setTempInStock,
    selectedItems: Array.from(selectedItems),
    setSelectedItems,
    toggleSelectedItem,
    isLoading,
    needStatsUpdate,
    setNeedStatsUpdate,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
