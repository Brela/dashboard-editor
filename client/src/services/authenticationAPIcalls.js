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
    console.log("the below two errors are from authenticateUser in FE");
    console.error("Error during authentication:", error);
    throw new Error(error.response?.data?.message || "UnknownError");
  }
};
