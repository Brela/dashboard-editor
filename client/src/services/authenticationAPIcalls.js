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

    const responseBody = response.data;

    if (response.status === 401) {
      if (responseBody.error === "TokenExpiredError") {
        throw new Error("TokenExpired");
      } else {
        throw new Error("Unauthorized");
      }
    }

    return responseBody;
  } catch (error) {
    console.error("Error during authentication:", error.message);
    throw error;
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
    throw new Error(error.response?.data?.error || "UnknownError");
  }
};
