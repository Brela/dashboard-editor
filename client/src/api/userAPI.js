import axios from "axios";
import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const createUser = async (username, password, isTempAccount) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/register`,
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

    setTokensInStorage(response.data);

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
      `${API_URL}/user/login`,
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

    setTokensInStorage(response.data);

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
      `${API_URL}/user/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    toast.success("Logged out successfully. 👋", { position: "bottom-center" });

    removeTokensFromStorage();

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

// although accessToken and refreshToken are set with cookies from backend response, there is a bug on mobile where cookies are not being set -
// this is a temp solution to use local storage to store tokens
const setTokensInStorage = (data) => {
  const { accessToken, refreshToken } = data;
  console.log(accessToken);
  if (accessToken && refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

const removeTokensFromStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
