import React, { useState } from "react";
import { Modal, InfoCard, Button, Input } from "../../../../components";
import { updateDashboard } from "../../../../services/dashboardAPIcalls";
import { notifySuccess } from "../../../../utils/notificationWrapper";
import { useQueryClient } from "react-query";

const EditDashboardNameModal = ({ open, closeModal, dashboard }) => {
  const queryClient = useQueryClient();
  const [newDashboardName, setNewDashboardName] = useState("");
  const [loading, setLoading] = useState(false);

  const [inModalError, setInModalError] = useState({
    type: "",
    message: "",
    title: "",
  });
  const clearError = () => {
    setInModalError({ type: "", message: "", title: "" });
  };

  const handleEditName = async () => {
    setLoading(true);
    clearError();

    console.log(newDashboardName);
    try {
      const data = {
        name: newDashboardName,
      };

      const editedDashboard = await updateDashboard(dashboard?.id, data);
      console.log(editedDashboard);
      queryClient.invalidateQueries("dashboards");
      notifySuccess(`Dashboard name changed to ${editedDashboard?.name}.`);

      closeModal(); // Close the modal on successful creation
    } catch (err) {
      setInModalError({
        type: "error",
        title: "Error",
        message: err.message || "Failed to edit dashboard",
      });
      setTimeout(() => {
        clearError();
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title=""
      open={open}
      setOpen={closeModal}
      modalStyle={`md:max-w-md overflow-y-auto`}
      placement="top"
      ui={
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditName();
            }}
          >
            <div className=" text-center sm:ml-4 sm:mt-0 sm:text-left pb-5">
              <Input
                label={"Edit This Dashboard's Name"}
                placeholder={dashboard?.name}
                labelClassname="text-gray-400"
                className="w-[300px]"
                onChange={(e) => setNewDashboardName(e.target.value)}
              ></Input>
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
              <Button size="sm" isLoading={loading} onClick={handleEditName}>
                Save
              </Button>
            </div>
          </form>
        </>
      }
    />
  );
};

export default EditDashboardNameModal;
