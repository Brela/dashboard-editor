import { useContext, useState } from "react";
import { InventoryContext } from "../../../contexts/inventory.context";
import { deleteInventoryItems } from "../../../services/inventoryAPIcalls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import calculateTotal from "../../../utils/calcShippingAndTotal";
import {
  faTimes,
  faTrash,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "./ConfirmModal";
import { createOrderItem } from "../../../services/ordersAPIcalls";
import { toast } from "react-hot-toast";

export default function SelectedRowsModal({ isOpen, onClose, selectedRows }) {
  const {
    reloadInventory,
    selectedItems,
    setNeedStatsUpdate,
  } = useContext(InventoryContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const confirmDelete = async () => {
    try {
      const itemIdsToDelete = selectedRows.map((row) => row.id);
      await deleteInventoryItems(itemIdsToDelete);
      reloadInventory();
      setNeedStatsUpdate(true);
      setConfirmModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error deleting products:", error);
      throw new Error("An error occurred while deleting products.");
    }
  };

  const handlePlaceOrders = async () => {
    const toastId = toast.loading("Please wait while we process your order.");

    try {
      for (const row of selectedRows) {
        const priceEa = row.unitPrice 
        const { total } = calculateTotal(row.orderQty, priceEa);

        const order = {
          sku: row.sku,
          orderQty: row.orderQty,
          totalCost: total,
        };

        const orderResponse = await createOrderItem(order);
        onClose();
        setNeedStatsUpdate(true);
        toast.dismiss(toastId);
        toast.success("Order processed successfully.");
        console.log("Order Response:", orderResponse);
      }
    } catch (error) {
      console.error("Error placing orders:", error);
      toast.dismiss(toastId);
      toast.error("Unable to place your order. Please try again.");
    }
  };

  const handleDeleteProducts = () => {
    setConfirmModalOpen(true);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white  px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex justify-between items-start">
            <h3 className="text-xl  font-bold text-zinc-700">Options</h3>
            <FontAwesomeIcon
              icon={faTimes}
              className="cursor-pointer text-xl text-zinc-500 hover:text-zinc-400"
              onClick={onClose}
            />
          </div>
          <div className=" px-4 py-4 sm:p-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>SKU</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.sku}</td>
                    <td>{row.productName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-4 mt-4">
              <button
                type="button"
                className="mt-4 bg-emerald-400/80 font-bold hover:bg-emerald-400/70 text-emerald-800 p-2 px-3 rounded-lg"
                onClick={() => handlePlaceOrders()}
              >
                <FontAwesomeIcon
                  icon={faCartPlus}
                  className="mr-2 text-emerald-600"
                />
                Single Order
              </button>
              <button
                type="button"
                className="mt-4 bg-zinc-300 font-bold hover:bg-zinc-300/80 text-zinc-600 p-2 px-3 rounded-lg"
                onClick={() => handleDeleteProducts(selectedItems)}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="mr-2 text-zinc-400"
                />
                Delete Items
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          onClose();
        }}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete the selected items?"
      />
    </div>
  );
}
