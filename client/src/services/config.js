import axios from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
import { userJwt } from "../../appwriteConfig";

export const API = (url) => {
  const token = userJwt.jwt;
  console.log(token);

  const instance = axios.create({
    baseURL: API_URL + url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return instance;
};
