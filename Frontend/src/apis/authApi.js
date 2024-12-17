import axios from "axios";
import { authEndpoints } from "./apisEndpoints.js";

const {
  SEND_OTP_API_URL,
  SIGNUP_API_URL,
  LOGIN_API_URL,
  LOGOUT_API_URL,
  PASSWORD_RESET_OTP_API_URL,
  PASSWORD_RESET_API_URL,
  DELETE_ACCOUNT_API_URL,
  CHANGE_PASSWORD_API_URL,
} = authEndpoints;

// Handle common Axios options
const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

export const sendOTP = async (userData) => {
  try {
    const response = await axios.post(SEND_OTP_API_URL, userData, axiosConfig);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await axios.post(SIGNUP_API_URL, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(LOGIN_API_URL, userData, axiosConfig);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(LOGOUT_API_URL, {
      withCredentials: true,
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error.response?.data || error.message);
    throw error;
  }
};

export const changePassword = async (userData) => {
  try {
    const response = await axios.post(
      CHANGE_PASSWORD_API_URL,
      userData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const requestPasswordResetOtp = async (userData) => {
  try {
    const response = await axios.post(
      PASSWORD_RESET_OTP_API_URL,
      userData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (userData) => {
  try {
    const response = await axios.post(
      PASSWORD_RESET_API_URL,
      userData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await axios.delete(DELETE_ACCOUNT_API_URL, axiosConfig);
    return response.data;
  } catch (error) {
    console.error(
      "Error while Deleting Account :",
      error.response?.data || error.message
    );
    throw error;
  }
};
