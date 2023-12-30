import React, { createContext, useEffect, useState } from "react";

export const DashboardContext = createContext({
  hasUnsavedChanges: false,
  openConfirmUnsavedModal: false,
  setHasUnsavedChanges: () => {},
  setOpenConfirmUnsavedModal: () => {},
});

export const DashboardProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [openConfirmUnsavedModal, setOpenConfirmUnsavedModal] = useState(false);

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
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
