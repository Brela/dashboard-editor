import React, { useState } from "react";
import { Modal, InfoCard, Button } from "../../../../components";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { deleteDashboard } from "../../api";
import { useQueryClient } from "react-query";
import { notifySuccess } from "../../../../utils/notificationWrapper";

const DeleteDashboardModal = ({ open, closeModal, dashboard }) => {
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  const [inModalError, setInModalError] = useState({
    type: "",
    message: "",
    title: "",
  });
  const clearError = () => {
    setInModalError({ type: "", message: "", title: "" });
  };

  const handleDelete = async () => {
    setLoading(true);
    clearError();

    try {
      let dashboardIdToDelete = dashboard?.id;
      await deleteDashboard(dashboardIdToDelete);
      notifySuccess(`Deleted ${dashboard?.name}.`);

      queryClient.invalidateQueries("dashboards"); // Refresh the list of dashboards
      queryClient.invalidateQueries(["widgets", dashboardIdToDelete]); // invalidate the widgets for the deleted dashboard

      closeModal();
    } catch (error) {
      setInModalError({
        type: "error",
        title: "Error",
        message: error.message || "Failed to delete dashboard",
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
                  {`Delete ${dashboard?.name} Dashboard`}
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p className="">
                    Are you sure you want to delete {dashboard?.name}?
                  </p>
                  <p>This action cannot be undone.</p>
                </div>
              </div>
            </div>
            {inModalError.message !== "" && (
              <InfoCard
                type={inModalError.type}
                message={inModalError.message}
                title={inModalError.title}
                forever={true}
              />
            )}
            <div className="mt-5 sm:mt-4 flex gap-3 justify-end">
              <Button size="sm" variant="ghost" onClick={() => closeModal()}>
                Cancel
              </Button>
              <Button size="sm" isLoading={isLoading} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </>
        );
      })()}
    />
  );
};

export default DeleteDashboardModal;
