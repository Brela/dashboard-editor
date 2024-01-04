import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InventoryContext } from "../../../contexts/inventory.context.jsx";
import { faFileImport, faBox, faPlus } from "@fortawesome/free-solid-svg-icons";
import { sendCSVfile } from "../../../services/inventoryAPIcalls.js";
import AddProductPopup from "./AddProductPopup.jsx";
import CSVModal from "./CsvModal.jsx";
import ToolbarButton from "../../../components/ToolbarButton.jsx";

export default function AddProductButtons({ data }) {
  const { reloadInventory, userData } = useContext(InventoryContext);

  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  const closeCSVPopup = () => {
    setIsCSVModalOpen(false);
    if (document?.getElementById("csv-file")) {
      const csvButton = document.getElementById("csv-file").click();
    }
  };

  const handleChange = async (e) => {
    if (!e.target.files[0]) {
      return;
    }
    await sendCSVfile(e.target.files[0]);
    reloadInventory();
  };
  // -------------------------- Popup ----------------------------
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="flex py-1 ml-1 md:ml-0 ">
      <ToolbarButton
        text="Add Item"
        onClick={() => setIsPopupOpen(true)}
        icon={faPlus}
      />

      <ToolbarButton
        text="From File"
        onClick={() => setIsCSVModalOpen(true)}
        icon={faFileImport}
      />

      {isPopupOpen && <AddProductPopup onClose={closePopup} />}
      {isCSVModalOpen && (
        <CSVModal
          isOpen={isCSVModalOpen}
          onClose={closeCSVPopup}
          onCancel={() => setIsCSVModalOpen(false)}
        />
      )}

      <input
        type="file"
        accept=".csv"
        onChange={(e) => handleChange(e)}
        style={{ display: "none" }}
        id="csv-file"
      />
    </div>
  );
}
