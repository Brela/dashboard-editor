import axios from "axios";
import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/user/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

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

export const updateUser = async (id, updates) => {
  try {
    const response = await axios.patch(`${API_URL}/user/${id}`, updates, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    toast.error("An error occurred during the update process:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    toast.error("An error occurred during the delete process:", error);
    throw error;
  }
};

export const createSeedDataForUser = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/user/seeds`,
      {
        // username,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    toast.error(
      `Failed to create seed data: ${
        error.response?.data.message || error.message
      }`,
    );
    return null;
  }
};
