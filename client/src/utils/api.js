import axios from "axios";

const API = (url) => {
  return axios.create({
    baseURL: process.env.VITE_REACT_APP_API_URL + "/app" + url,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": process.env.VITE_REACT_APP_API_URL,
    },
    withCredentials: true,
  });
};

export default API;
