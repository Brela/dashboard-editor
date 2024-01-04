import React from "react";
import toast from "react-hot-toast";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  selectedRows,
}) {
  if (!isOpen) return null;

  if (selectedRows.length < 1)
    return toast.error("Please select some items to delete.");

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
          <div className="px-4 py-5">
            <p>{message}</p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={onClose}
                className="mr-3 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
