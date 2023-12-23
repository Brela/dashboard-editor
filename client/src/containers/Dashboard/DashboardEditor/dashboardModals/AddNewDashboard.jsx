import React, { useEffect, useState } from "react";
import { createDashboard } from "../../api";
import { Modal, InfoCard, Button, Input } from "../../../../components";
import { notifySuccess } from "../../../../utils/notificationWrapper";
import { useQueryClient } from "react-query";

const AddNewDashboardModal = ({
  open,
  closeModal,
  dashboards,
  handleSelectionChange,
}) => {
  const queryClient = useQueryClient();

  const [dashboardName, setDashboardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [inModalError, setInModalError] = useState({
    type: "",
    title: "",
    message: "",
  });
  const [newDashboard, setNewDashboard] = useState(null);
  const clearError = () => {
    setInModalError({ type: "", message: "", title: "" });
  };

  const handleAddDashboard = async () => {
    setLoading(true);
    clearError();

    try {
      const data = {
        name: dashboardName,
      };

      const createdDashboard = await createDashboard(data);
      setNewDashboard(createdDashboard);
      queryClient.invalidateQueries("dashboards");
      notifySuccess(`Created new dashboard: ${createdDashboard?.name} `);

      closeModal();
    } catch (err) {
      setInModalError({
        type: "error",
        title: "Error",
        message: err.message || "Failed to add dashboard",
      });
      setTimeout(() => {
        clearError();
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // once new dashboard is in dashboards, handleSelectionChange to update local storage
  useEffect(() => {
    if (newDashboard && dashboards.some((d) => d.id === newDashboard.id)) {
      handleSelectionChange(newDashboard.id);
      setNewDashboard(null); // Reset to avoid re-triggering this effect
    }
  }, [newDashboard, dashboards, handleSelectionChange]);

  return (
    <Modal
      title={"Add New Dashboard"}
      open={open}
      setOpen={closeModal}
      ui={
        <>
          <div className="text-center sm:ml-4 sm:mt-0 sm:text-left py-5">
            <Input
              label="Name"
              labelClassname="text-gray-400"
              className="w-[300px]"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
            />
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
            <Button size="sm" isLoading={loading} onClick={handleAddDashboard}>
              Add
            </Button>
          </div>
        </>
      }
      modalStyle={`md:max-w-md overflow-y-auto`}
      placement="top"
    />
  );
};

export default AddNewDashboardModal;
