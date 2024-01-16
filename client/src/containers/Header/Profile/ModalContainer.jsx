import React from "react";

const ModalContainer = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-50 flex-row-reverse items-center rounded-2xl w-full sm:w-1/2 md:w-1/3 p-6 mx-5 sm:mx-0 ">
        <button
          onClick={onClose}
          className="float-right text-2xl font-bold text-zinc-500 hover:text-zinc-600"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ModalContainer;
