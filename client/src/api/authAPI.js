import { API } from "./config";

export const authenticateUser = async () => {
  try {
    const response = await API("/authentication/authenticateUser").get("/");
    return response.data;
  } catch (error) {
    throw new Error(
      `AuthenticateUser FE: ${error.response?.data?.message}` ||
        "Error During Authentication",
    );
  }
};
