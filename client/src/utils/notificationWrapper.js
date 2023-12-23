import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export const notifySuccess = (message) => {
  toast.success(message, {
    position: toast.POSITION.BOTTOM_CENTER,
    toastId: uuidv4(),
    pauseOnHover: false,
    autoClose: 2000,
    hideProgressBar: true,
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: toast.POSITION.BOTTOM_CENTER,
    toastId: uuidv4(),
    pauseOnHover: false,
    autoClose: 3000,
    hideProgressBar: true,
  });
};
