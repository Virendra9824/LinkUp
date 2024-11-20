import axios from "axios";
import { authEndpoints } from "./apisEndpoints.js";

const { LOGIN_API_URL, SIGNUP_API_URL, LOGOUT_API_URL } = authEndpoints;

export const login = async (userData) => {
  const response = await axios.post(LOGIN_API_URL, userData, {
    withCredentials: true,
  });
  localStorage.setItem("token", JSON.stringify(response.data.token));
  return response.data;
};

export const signup = async (userData) => {
  const response = await axios.post(SIGNUP_API_URL, userData);
  return response.data;
};

export const logout = async () => {
  await axios.post(LOGOUT_API_URL);
};
