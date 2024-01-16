import React, { useState } from "react";
import { InfoCard, Modal, Button } from "../../../../components";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { deleteCustomWidget } from "../../../../api/dashboardAPI";

const DeleteCustomWidgetModal = ({
  open,
  closeModal,
  customWidgets,
  setCustomWidgetsList,
  modal,

  setNotification,
}) => {
  const widgetId = modal.id;
  const widget = customWidgets?.find((w) => w.id === widgetId);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    type: "",
    message: "",
    title: "",
  });
  const clearError = () => {
    setError({ type: "", message: "", title: "" });
  };

  const handleDelete = async () => {
    setLoading(true);
    clearError();
    setNotification({ type: "", message: "", title: "" });

    try {
      await deleteCustomWidget(widget.id);
      setNotification({
        type: "success",
        title: "Success",
        message: `${widget?.name} custom widget deleted.`,
      });
      setTimeout(() => {
        setNotification({ type: "", message: "", title: "" });
      }, 5000);

      setCustomWidgetsList((prev) => prev.filter((w) => w.id !== widget.id));
      closeModal();
    } catch (error) {
      setError({
        type: "error",
        title: "Error",
        message: error.message || "Failed to delete custom widget",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={""}
      open={open}
      modalStyle={`md:max-w-md overflow-y-auto`}
      placement="top"
      setOpen={closeModal}
      ui={(() => {
        return (
          <>
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  {`Delete ${widget?.name || "unknown"}`}
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p className="">
                    Are you sure you want to delete {widget?.name || "unknown"}?
                  </p>
                  <p>This action cannot be undone.</p>
                </div>
              </div>
            </div>
            {error.message !== "" && (
              <InfoCard
                type={error.type}
                message={error.message}
                title={error.title}
                forever={true}
              />
            )}
            <div className="mt-5 sm:mt-4 flex gap-3 justify-end">
              <Button size="sm" variant="ghost" onClick={() => closeModal()}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </>
        );
      })()}
    />
  );
};

export default DeleteCustomWidgetModal;
