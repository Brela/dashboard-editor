import axios from "axios";
import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const createUser = async (username, password, isTempAccount) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/`,
      {
        username,
        password,
        isTempAccount: isTempAccount ? true : false,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    // for testing no cookies being set on iPhone
    console.log("Response Headers:", response.headers);

    return response.data;
  } catch (error) {
    toast.error(
      `Failed to sign up: ${error.response?.data.message || error.message}`,
    );
    return null;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/authentication/login`,
      {
        username,
        password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // for testing no cookies being set on iPhone
    console.log("Response Headers:", response.headers);

    return response.data;
  } catch (error) {
    if (error.response) {
      toast.error(`Error: ${error.response.data.message || "Failed to login"}`);
    } else {
      toast.error("An error occurred.");
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/authentication/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    toast.success("Logged out successfully. 👋", { position: "bottom-center" });

    return response.data;
  } catch (error) {
    if (error.response) {
      toast.error(
        `Error: ${error.response.data.message || "Failed to logout"}`,
      );
    } else {
      toast.error("An error occurred while logging out.");
    }
    throw error;
  }
};
