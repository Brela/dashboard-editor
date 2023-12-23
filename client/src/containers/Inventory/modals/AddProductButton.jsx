import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InventoryContext } from "../../../contexts/inventory.context";
import { faFileImport, faBox } from "@fortawesome/free-solid-svg-icons";
import { sendCSVfile } from "../../../services/inventoryAPIcalls";
import AddProductPopup from "./AddProductPopup.jsx";
import CSVModal from "./CsvModal";

export default function AddProductButton({ data }) {
  const { reloadInventory, userData } = useContext(InventoryContext);

  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  const openCSVPopup = () => {
    setIsCSVModalOpen(true);
  };

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

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="flex  ml-1 md:ml-0 gap-1 md:gap-4 text-zinc-700 font-semibold text-sm">
      <button
        className="bg-zinc-200 hover:bg-zinc-300/70 p-2 px-4 rounded-full flex items-center gap-2"
        onClick={openPopup}
      >
        <FontAwesomeIcon icon={faBox} className="text-base text-zinc-400" />
        Add Item
      </button>

      <button
        className="bg-zinc-200 hover:bg-zinc-300/70 p-2 px-4 rounded-full flex items-center gap-2"
        onClick={openCSVPopup}
      >
        <FontAwesomeIcon
          icon={faFileImport}
          className="text-base text-zinc-400"
        />
        From File
      </button>

      {isPopupOpen && <AddProductPopup onClose={closePopup} />}
      {isCSVModalOpen && (
        <CSVModal isOpen={isCSVModalOpen} onClose={closeCSVPopup} />
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
