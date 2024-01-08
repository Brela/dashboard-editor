const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
import axios from "axios";

export const authenticateUser = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/authentication/authenticateUser`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error during authentication:", error.message);
    throw new Error(error.response?.data?.message || "UnknownError");
  }
};

export const getToken = async () => {
  try {
    const response = await axios.get(`${API_URL}/authentication/token`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching the token:", error.message);
    throw new Error(error.response?.data?.message || "UnknownError");
  }
};
