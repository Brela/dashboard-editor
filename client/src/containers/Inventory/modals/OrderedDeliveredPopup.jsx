import React, { useState, useEffect, useContext } from "react";
import "./orderedDeliveredPopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { OrdersContext } from "../../../contexts/orders.context";

export default function OrderedDeliveredPopup() {
  const {
    displayOrderedDeliveredPopup,
    setDisplayOrderedDeliveredPopup,
    orderedDeliveryPopupContent,
    setOrderedDeliveryPopupContent,
  } = useContext(OrdersContext);
  const [popupTimeoutId, setPopupTimeoutId] = useState(null);

  useEffect(() => {
    if (displayOrderedDeliveredPopup) {
      if (popupTimeoutId) {
        clearTimeout(popupTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        setDisplayOrderedDeliveredPopup(false);
        setOrderedDeliveryPopupContent([]);
      }, 10000);

      setPopupTimeoutId(timeoutId);
    }
  }, [displayOrderedDeliveredPopup, ...orderedDeliveryPopupContent]);

  useEffect(() => {
    return () => {
      if (popupTimeoutId) {
        clearTimeout(popupTimeoutId);
      }
    };
  }, [displayOrderedDeliveredPopup]);

  const handleClose = () => {
    setDisplayOrderedDeliveredPopup(false);
    setOrderedDeliveryPopupContent([]);
  };

  return (
    <>
      {displayOrderedDeliveredPopup && (
        <div className="notification-popup">
          <div className="">
            {/* //`Delivered ${order.orderQty} - ${order.SKU} - ${order.product.brand} - ${order.product.productName}` */}
            <h4 className="deliv-or-ordered">
              {orderedDeliveryPopupContent[0] === "d" ? "Delivered" : "Ordered"}
            </h4>
            <div className="two-sections-of-columns">
              <div className="sku-and-quantity">
                <p>
                  <span>QTY: </span>
                  {orderedDeliveryPopupContent[0] === "d"
                    ? orderedDeliveryPopupContent[1].orderQty
                    : orderedDeliveryPopupContent[2].orderQty}
                </p>
                <p>
                  <span>SKU: </span>
                  {orderedDeliveryPopupContent[0] === "d"
                    ? orderedDeliveryPopupContent[1].SKU
                    : orderedDeliveryPopupContent[2].sku}
                </p>
              </div>
              <div>
                <p className="allow-overflow-p">
                  <span>Brand: </span>
                  {orderedDeliveryPopupContent[0] === "d"
                    ? orderedDeliveryPopupContent[1].product.brand
                    : orderedDeliveryPopupContent[1].brand}{" "}
                </p>
                <p>
                  <span>Name: </span>{" "}
                  {orderedDeliveryPopupContent[0] === "d"
                    ? orderedDeliveryPopupContent[1].product.productName
                    : orderedDeliveryPopupContent[1].productName}{" "}
                </p>
              </div>
            </div>
          </div>
          <button className="close-button" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
    </>
  );
}
