import axios from "axios";
import { userEndpoints } from "./apisEndpoints.js";

const { GET_FOLLOWINGS_API_URL } = userEndpoints;

export const getFollowings = async () => {
  const response = await axios.get(GET_FOLLOWINGS_API_URL, {
    withCredentials: true,
  });
  return response.data;
};
