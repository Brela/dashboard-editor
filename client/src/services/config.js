// API URL to be imported in services files with API calls  --- when we change the port for production, we only have to change it here
import axios from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const API = (url) => {
  console.log("here axios");
  return axios.create({
    baseURL: API_URL + url,
    headers: {
      "Content-Type": "application/json",
      //   "Access-Control-Allow-Origin": API_URL,
    },
    withCredentials: true,
  });
};
