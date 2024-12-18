import axios from "axios";
import { userEndpoints } from "./apisEndpoints.js";

const {
  GET_FOLLOWINGS_API_URL,
  GET_USER_BY_ID,
  FOLLOW_UNFOLLOW_USER_API_URL,
  UPDATE_PROFILE_API_URL,
} = userEndpoints;

export const getFollowings = async () => {
  const response = await axios.get(GET_FOLLOWINGS_API_URL, {
    withCredentials: true,
  });
  return response.data;
};

export const getUserByID = async (userId) => {
  const response = await axios.post(`${GET_USER_BY_ID}/${userId}`, null, {
    withCredentials: true,
  });
  return response.data;
};

export const followUnfollowReqest = async (userId) => {
  const response = await axios.post(
    `${FOLLOW_UNFOLLOW_USER_API_URL}/${userId}`,
    null,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await axios.put(UPDATE_PROFILE_API_URL, formData, {
    withCredentials: true,
  });
  return response.data;
};
