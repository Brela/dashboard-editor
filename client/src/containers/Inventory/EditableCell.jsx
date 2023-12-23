import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export const EditableCell = ({
  value,
  row,
  accessor,
  updateFunction,
  reloadFunction,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isEdited, setIsEdited] = useState(false);

  const handleSave = async () => {
    const id = row.original.id;
    try {
      await updateFunction(id, { [accessor]: parseInt(inputValue, 10) });
      toast.success(`Successfully updated ${accessor}`);
      setIsEdited(false);
      reloadFunction();
    } catch (err) {
      toast.error(`An error occurred while updating ${accessor}`);
    }
  };

  const handleCancel = (e) => {
    if (e.relatedTarget && e.relatedTarget.tagName === "BUTTON") {
      return;
    }
    setInputValue(value);
    setIsEdited(false);
  };

  return (
    <div className="flex items-center">
      <input
        className="bg-zinc-50 w-10 p-1 border rounded-lg border-zinc-300 outline-zinc-400"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsEdited(true);
        }}
        onBlur={handleCancel}
      />
      {isEdited && (
        <button onClick={handleSave} className="ml-2">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-emerald-500 text-lg"
          />
        </button>
      )}
    </div>
  );
};
