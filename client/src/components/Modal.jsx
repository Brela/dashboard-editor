import { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Modal = ({
  open,
  setOpen,
  ui,
  title,
  modalStyle,
  placement,
  contentClassName,
  customCancel,
}) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className={`flex min-h-full justify-center p-4 text-center sm:p-0 ${
              placement === "top" ? "mt-20 items-start" : "items-center"
            }`}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={twMerge(
                  "relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-xl md:max-w-2xl",
                  modalStyle,
                )}
              >
                {title !== "" && (
                  <div className="absolute flex w-full justify-between p-5">
                    <div className="text-xl font-semibold text-gray-600">
                      {title}
                    </div>
                    <div>
                      {(customCancel && (
                        <div
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          {customCancel}
                        </div>
                      )) || (
                        <XMarkIcon
                          className="h-6 w-6 cursor-pointer text-gray-500 transition-all hover:text-black"
                          onClick={() => {
                            setOpen(false);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                <div
                  className={twMerge(
                    "mt-5 bg-white px-4 py-4",
                    contentClassName,
                  )}
                >
                  {ui}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
