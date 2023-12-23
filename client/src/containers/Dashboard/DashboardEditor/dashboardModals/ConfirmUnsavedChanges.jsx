import React, { useState } from "react";
import { Modal, InfoCard, Button } from "../../../../components";
import { useNavigate } from "react-router-dom";

const ConfirmUnsavedChanges = ({ open, closeModal, onSave }) => {
  const navigate = useNavigate();
  const [error, setError] = useState({
    type: "",
    title: "",
    message: "",
  });
  const clearError = () => {
    setError({ type: "", message: "", title: "" });
  };

  const handleSave = () => {
    onSave()
      .then((successMessage) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        setError({ type: "error", title: "Error", message: error.message });
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
              onClick={() => navigate("/dashboard")}
            >
              Continue Without Saving
            </Button>
            <Button size="sm" variant="success" onClick={handleSave}>
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
