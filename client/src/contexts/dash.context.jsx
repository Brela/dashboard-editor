import React, { createContext, useEffect, useState } from "react";

export const DashboardContext = createContext({
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
  openConfirmUnsavedModal: false,
  setOpenConfirmUnsavedModal: () => {},
  useEditorInMobileAnyway: false,
  setUseEditorInMobileAnyway: () => {},
});

export const DashboardProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [openConfirmUnsavedModal, setOpenConfirmUnsavedModal] = useState(false);
  const [useEditorInMobileAnyway, setUseEditorInMobileAnyway] = useState(false);

  useEffect(() => {
    console.log("---- open Modal ----", openConfirmUnsavedModal);
  }, [openConfirmUnsavedModal]);

  useEffect(() => {
    console.log("hasUnsaveDChanges in context ----", hasUnsavedChanges);
  }, [hasUnsavedChanges]);

  return (
    <DashboardContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        openConfirmUnsavedModal,
        setOpenConfirmUnsavedModal,
        useEditorInMobileAnyway,
        setUseEditorInMobileAnyway,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
