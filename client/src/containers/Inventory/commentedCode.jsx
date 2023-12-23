  // -------------------- load and reload inventory ------------------------------

//    useEffect(() => {
//     // console.log(inventory);

//     const storedOrder = JSON.parse(localStorage.getItem('inventoryOrder'));
//     if (storedOrder) {
//       const orderedInventory = storedOrder
//         .map((id) => inventory.find((item) => item.id === id))
//         .filter((item) => item !== undefined);

//       // Only update the state if the order has changed
//       if (
//         JSON.stringify(orderedInventory.map((item) => item.id)) !==
//         JSON.stringify(inventory.map((item) => item.id))
//       ) {
//         reloadInventory(orderedInventory);
//       }
//     }
//   }, [inventory, reloadInventory]);



  /*  This code is in the works - will have multiple trigger points
 //  The lastOrderedRange state is an object with item IDs as keys and these strings as values. 
 //     When the inventory items are checked for reordering, the system will compare the current range (range) with the 
 //     last ordered range (lastOrderedRange[item.id]). If the current range is different from the last ordered range, 
 //     it means the stock level has moved to a new range, and the system can create a new order. 
 //     This prevents multiple orders from being created within the same percentage range. 
 
   // State to keep track of the last ordered range for each item
   const [lastOrderedRange, setLastOrderedRange] = useState({});
   const [lastStockLevel, setLastStockLevel] = useState({});
   const [prevTempInStock, setPrevTempInStock] = useState({});
 
   // Function to determine the percentage range of the current stock level
   const checkRange = (percentage) => {
     if (percentage >= 0 && percentage <= 0.35) return 'percent0to35';
     if (percentage > 0.35 && percentage <= 0.7) return 'percent35to70';
     if (percentage > 0.7 && percentage <= 1) return 'percent70to100';
     return null;
   };
 
   useEffect(() => {
     inventory.forEach((item) => {
       const totalCost = handleCalculateTotals(item.orderQty, item.unitPrice);
       // Calculate the current stock level percentage (current stock / reorder level)
       const percentage = tempInStock[item.id] / item.reorderAt;
       // Determine the range of the current stock level percentage
       const range = checkRange(percentage);
 
       // Check if the current item should create a new order
       // If there's no last ordered range for the item or the last ordered range is different from the current range
       const canCreateOrder = !lastOrderedRange[item.id] || lastOrderedRange[item.id] !== range;
       const stockLevelChanged = !lastStockLevel[item.id] || lastStockLevel[item.id] !== tempInStock[item.id];
       // If the current range exists, the app is using stock, the reorderAt value is not 0, and an order can be created
       if (
         range &&
         isUsingStock &&
         item.reorderAt != 0 &&
         canCreateOrder &&
         stockLevelChanged
       ) {
         // Create an order item object
         const orderInfo = {
           sku: item.sku,
           orderQty: item.orderQty,
           totalCost: totalCost,
         };
 
         createOrderItem(orderInfo)
           .then(() => {
             reloadOrders();
             // Update the last ordered range state for the current item
             setLastOrderedRange((prevState) => ({
               ...prevState,
               [item.id]: range,
             }));
             // Update the last stock level state for the current item
             setLastStockLevel((prevState) => ({
               ...prevState,
               [item.id]: tempInStock[item.id],
             }));
           })
           .catch((error) => {
             console.error('Error creating order item:', error);
           });
       }
     });
   }, [tempInStock, isUsingStock, lastOrderedRange]);
 
   useEffect(() => {
     // Iterate through tempInStock object
     Object.keys(tempInStock).forEach((itemId) => {
       // Check if the stock level has increased for the current item
       if (!prevTempInStock[itemId] || tempInStock[itemId] > prevTempInStock[itemId]) {
         // Reset lastOrderedRange state for the current item
         setLastOrderedRange((prevState) => ({
           ...prevState,
           [itemId]: null,
         }));
       }
     });
 
     // Update prevTempInStock state with the current tempInStock values
     setPrevTempInStock(tempInStock);
   }, [tempInStock]); */



     /* const { data, isError } = useQuery('authenticateUser', authenticateUser, {
    onSuccess: (data) => {
      if (data === 'JsonWebTokenError' || data === 'TokenExpiredError') {
        navigate('/login');
      }
    },
  }); 
  useEffect(() => {
    if (isError) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Unable to communicate with the server. Please refresh the webpage.`,
        background: "#333",
        color: "#fff",
        confirmButtonColor: "#3b9893",
      });
    } else {
      if (data?.username) {
        toast.success(`Welcome back ${data?.username}`, {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  }, [data]); */














  import React, { useEffect, useContext, useState, useRef, useMemo } from "react";
import { InventoryContext } from "../../contexts/inventory.context";
import { updateInventoryItem } from "../../services/inventoryAPIcalls";
import { OrdersContext } from "../../contexts/orders.context";
import { createOrderItem } from "../../services/ordersAPIcalls";
import calculateTotal from "../../utils/calcShippingAndTotal";

import { useNavigate } from "react-router-dom";
import { useDropdown } from "../../hooks/useDropDown";
import { PinningContext } from "../../contexts/pinning.context";

// import AddProductRow from './popups/AddProductRow';
import SelectedCheckboxOptionsPopup from "./popups/CheckboxOptions";
import OrderNowPopup from "./popups/OrderNow";
import "./popups/popup.css";
import { CustomCheckbox, renderHeaderContent } from "./CustomCheckbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faShoppingBag, faThumbTack } from "@fortawesome/free-solid-svg-icons";
library.add(faShoppingBag);
import { authenticateUser } from "../../services/authenticationAPIcalls";
import { useQuery } from "react-query";
import AddProductButton from "./popups/AddProductButton.jsx";
import ScaleLoader from "react-spinners/ScaleLoader";
import toast, { Toaster } from "react-hot-toast";
import { truncateString } from "../../utils/truncateString";
import Swal from "sweetalert2";
import FilterBy from "./FilterBy";

export default function Inventory({
  inventoryListScrollRef,
  ordersListScrollRef,
  rowHeightState,
  lastScrolledListRef,
}) {
  const {
    inventory,
    reloadInventory,
    isUsingStock,
    tempInStock,
    setTempInStock,
    selectedItems,
    toggleSelectedItem,
    isLoading,
  } = useContext(InventoryContext);
  const {
    activeOrders,
    reloadOrders,
    setDisplayOrderedDeliveredPopup,
    setOrderedDeliveryPopupContent,
  } = useContext(OrdersContext);

  const navigate = useNavigate();


  // ------------------------ pinning functionality --------------------------
  const { pinnedItems, pinItem, unpinItem, isPinned } =
    useContext(PinningContext);

  // new state for sorted inventory due to drag and drop interference
  const [sortedInventory, setSortedInventory] = useState(
    inventory ? [...inventory] : []
  );

  useEffect(() => {
    const sorted = [...inventory].sort((a, b) => {
      if (isPinned(a.id) && !isPinned(b.id)) {
        return -1;
      }
      if (!isPinned(a.id) && isPinned(b.id)) {
        return 1;
      }
      // Add a natural sorting order for items with the same pin status
      return inventory.indexOf(a) - inventory.indexOf(b);
    });
    setSortedInventory(sorted);
  }, [inventory, pinnedItems]);

  // -------------------- Authenticate user credentials on mount -----------------------------
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // -------------------- Trigger orders at reorder at points ------------------------------

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



  // keeping this old inventoryUsage code for now as backup
  useEffect(() => {
    // Check inventory for items that need to be re-ordered
    inventory.forEach((item) => {
      const totalCost = handleCalculateTotals(item.orderQty, item.unitPrice);
      // console.log(tempInStock[item.id], item.reorderAt);

      if (
        // when tempInStock hits the reorderAt or 80% of the reorderAt, trigger orders
        (tempInStock[item.id] === item.reorderAt ||
          tempInStock[item.id] === item.reorderAt * 0.8) &&
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
          /*     .then(async () => {
                const updatedItem = { inStock: Number(tempInStock[item.id]) };
                await updateInventoryItem(item.id, updatedItem);
              }) */
          .then(() => {
            reloadOrders();
            console.log(item);
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

  // -------------------- load and reload inventory ------------------------------


 
  const handleReloadInventory = () => {
    reloadInventory();
  };

  // -------------------- highlight selected products and corresponding orders ----------
  const [highlightSelectedProducts, setHighlightSelectedProducts] =
    useState(true);

  const getHighlightClassName = useMemo(() => {
    return (item) => {
      const selectedItemIndex = selectedItems.findIndex((id) => id === item.id);
      return selectedItemIndex !== -1 && highlightSelectedProducts
        ? selectedItemIndex % 2 === 0
          ? "highlight-selected-even"
          : "highlight-selected-odd"
        : "";
    };
  }, [highlightSelectedProducts, selectedItems]);

  // ------------------- synchronous scrolling (inventory and orders tables) --------------------
  useEffect(() => {
    const inventoryList = inventoryListScrollRef.current;
    const ordersList = ordersListScrollRef.current;

    const handleScroll = () => {
      const inventoryScrollRatio =
        inventoryList.scrollTop /
        (inventoryList.scrollHeight - inventoryList.clientHeight);
      ordersList.scrollTop = Math.round(
        inventoryScrollRatio *
          (ordersList.scrollHeight - ordersList.clientHeight)
      );
    };

    if (inventoryList && ordersList) {
      inventoryList.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (inventoryList) {
        inventoryList.removeEventListener("scroll", handleScroll);
      }
    };
  }, [inventoryListScrollRef, ordersListScrollRef]);


  // ------------- update items' input values when user changes them ---------------

  const handleKeyDown = async (event, id, field, value) => {
    if (event.keyCode === 13) {
      const updatedItem = { [field]: Number(value) };
      await updateInventoryItem(id, updatedItem);
      reloadInventory();
    }
  };

  // --------------------- all popups --------------------------
  // this is the whole product object to be passed down into popup
  const [productForPopup, setProductForPopup] = useState("");

  const [popup, setPopup] = useState(null);
  const handleOpenPopup = (product = null, event) => {
    if (event && event.target) {
      if (event.target.classList.contains("custom-checkbox")) {
        setPopup("selectedCheckboxOptions");
      } else {
        const targetId = event.target.id;
        setPopup(targetId);
        setProductForPopup(product);
      }
    }
  };

  // close dropdown if user clicks outside of the menu
  const { dropdownRef } = useDropdown();
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropOpen(false);
    }
  };
  const handleClosePopup = () => {
    setPopup(null);
    setProductForPopup(null);
  };

  // -------- merge drag and drop ref and scrolling sync ref to be used in the same element -----------
  const mergeRefs = (...refs) => {
    return (element) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(element);
        } else if (ref && typeof ref === "object") {
          ref.current = element;
        }
      });
    };
  };

  // ----------------------------------------------------------
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            iconTheme: {
              primary: "#3b9893",
              secondary: "white",
            },
          },
        }}
      />
      {isLoading && (
        <div className="scale-loader-container">
          <ScaleLoader
            color={"#3b9893"}
            loading={isLoading}
            height={200}
            width={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      <table id="inventory">
        <thead>
          <tr className="tr-inventory-title">
            <td>
              <h1>Inventory</h1>
            </td>
            <td>
              <FilterBy />
            </td>
            <td className="mobile-span-check" onClick={handleOpenPopup}>
              {renderHeaderContent("Checkbox", handleOpenPopup)}
            </td>
            <td id="add-prod-td">
              <AddProductButton />
            </td>
          </tr>
        </thead>
        <tbody className="inventory-tbody">
          <tr className="tr-header">
            <td onClick={handleOpenPopup}>
              {renderHeaderContent("Checkbox", handleOpenPopup)}
            </td>
            <td>SKU</td>
            <td>Brand</td>
            <td>Name</td>
            <td>Description</td>
            <td>Stock</td>
            <td>Target</td>
            <td>Ord. Qty</td>
            <td>Order</td>
            <td>Pin</td>
          </tr>
          {sortedInventory?.length > 0 ? (
            sortedInventory.map((item) => (
              <tr
                id={item.sku}
                className={`${getHighlightClassName(item)}
              ${isPinned(item.id) ? "pinned-item" : ""}`}
              >
                <td>
                  <CustomCheckbox
                    itemId={item.id}
                    onChange={toggleSelectedItem}
                    selectedItems={selectedItems}
                    sx={{
                      "&.Mui-checked": {
                        "& .MuiSvgIcon-root": {
                          fill: "var(--accent-color)",
                        },
                      },
                    }}
                  />
                </td>
                <td id="scrollForAddRow">
                  <span className="mobile-span">SKU</span>
                  {item.sku}
                  <span className="mobile-span-name">
                    Name: {item.productName}
                  </span>
                </td>
                <td className="hide-on-small">{item.brand}</td>
                <td className="hide-on-small">
                  <span className="mobile-span">Name</span>
                  {item.productName}
                </td>
                <td className="hide-on-small">
                  <div className="desc-text">
                    {truncateString(item.description, 30)}
                  </div>
                </td>
                <td>
                  <span className="mobile-span">Stock</span>
                  {tempInStock[item.id] || item.inStock}
                </td>
                <td>
                  <span className="mobile-span">Target</span>
                  <input
                    className="dynamic-inputs"
                    id="reorderAt"
                    type="text"
                    defaultValue={item.reorderAt}
                    onKeyDown={(event) =>
                      handleKeyDown(
                        event,
                        item.id,
                        "reorderAt",
                        event.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <span className="mobile-span">Ord. Qty</span>
                  <input
                    className="dynamic-inputs"
                    id="orderQty"
                    type="text"
                    defaultValue={item.orderQty}
                    onKeyDown={(event) =>
                      handleKeyDown(
                        event,
                        item.id,
                        "orderQty",
                        event.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <span className="mobile-span">Order</span>
                  <button
                    id="order"
                    onClick={(event) => {
                      handleOpenPopup(item, event);
                    }}
                  >
                    <FontAwesomeIcon
                      icon="fa-bag-shopping"
                      className="order-now-icon"
                      style={{ pointerEvents: "none" }}
                    />
                  </button>
                </td>
                <td className="hide-on-small">
                  {isPinned(item.id) ? (
                    <button onClick={() => unpinItem(item.id)}>
                      <FontAwesomeIcon
                        className="pin-icon"
                        icon={faThumbTack}
                        rotation={90}
                      />
                    </button>
                  ) : (
                    <button onClick={() => pinItem(item.id)}>
                      <FontAwesomeIcon
                        className="pin-icon"
                        icon={faThumbTack}
                      />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10}>No inventory data available.</td>
            </tr>
          )}
        </tbody>
      </table>
      {popup == "incoming" && (
        <IncomingPopup
          handleClosePopup={handleClosePopup}
          popup={popup}
          item={productForPopup}
          reloadInventory={handleReloadInventory}
        />
      )}
      {popup == "order" && (
        <OrderNowPopup
          handleClosePopup={handleClosePopup}
          popup={popup}
          item={productForPopup}
          reloadOrders={reloadOrders}
          handleReloadInventory={handleReloadInventory}
        />
      )}
      {popup == "selectedCheckboxOptions" && (
        <SelectedCheckboxOptionsPopup
          handleClosePopup={handleClosePopup}
          popup={popup}
          highlightSelectedProducts={highlightSelectedProducts}
          setHighlightSelectedProducts={setHighlightSelectedProducts}
        />
      )}
    </>
  );
}
