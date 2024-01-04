import React, { useState } from "react";
import { Modal, InfoCard, Button } from "../../../../components";
import { useNavigate } from "react-router-dom";

const ConfirmUnsavedChanges = ({
  open,
  closeModal,
  resetUnsavedChangesState,
  onSave,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    type: "",
    title: "",
    message: "",
  });
  const clearError = () => {
    setError({ type: "", message: "", title: "" });
  };

  const handleContinueWithoutSaving = () => {
    closeModal();
    resetUnsavedChangesState();
    navigate("/dashboard");
  };

  const handleSave = () => {
    setLoading(true);
    onSave()
      .then((successMessage) => {
        navigate("/dashboard");
        closeModal();
      })
      .catch((error) => {
        setError({ type: "error", title: "Error", message: error.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title={"You Have Unsaved Changes"}
      size={"sm"}
      open={open}
      setOpen={closeModal}
      ui={
        <>
          {error.message !== "" && (
            <InfoCard
              type={error.type}
              message={error.message}
              title={error.title}
              forever={true}
            />
          )}
          <div className="pb-4"></div>

          <div className="mt-10 sm:mt-4 flex gap-3 justify-center">
            <Button
              size="sm"
              variant="warning"
              onClick={handleContinueWithoutSaving}
            >
              Continue Without Saving
            </Button>
            <Button
              size="sm"
              variant="success"
              onClick={handleSave}
              isLoading={loading}
            >
              Save and Continue
            </Button>
          </div>
        </>
      }
      modalStyle={`md:max-w-md overflow-y-auto`}
      placement="top"
    />
  );
};

export default ConfirmUnsavedChanges;
