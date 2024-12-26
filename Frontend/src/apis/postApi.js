import axios from "axios";
import { postEndpoints } from "./apisEndpoints.js";

const {
  CREATE_POST_API_URL,
  LIKE_UNLIKE_POST_API_URL,
  COMMENT_ON_POST_API_URL,
  DELETE_COMMENT_API_URL,
  DELETE_POST_API_URL,
  UPDATE_POST_API_URL,
  GET_ALL_POSTS_API_URL,
} = postEndpoints;

export const createPost = async (userData) => {
  const formData = new FormData();

  // Append text data (caption)
  formData.append("caption", userData.postCaption);

  // Append file (image or video)
  if (userData.file) {
    formData.append("file", userData.file);
  }

  // Send the FormData to the backend
  const response = await axios.post(CREATE_POST_API_URL, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data", // Required for file uploads
    },
  });

  return response.data;
};

export const getAllPosts = async () => {
  const response = await axios.get(GET_ALL_POSTS_API_URL, {
    withCredentials: true,
  });
  return response.data.data;
};

export const likeUnlikePost = async (userData) => {
  const response = await axios.post(LIKE_UNLIKE_POST_API_URL, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const commentOnPost = async (data) => {
  const response = await axios.post(COMMENT_ON_POST_API_URL, data, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteComment = async (data) => {
  const response = await axios.post(DELETE_COMMENT_API_URL, data, {
    withCredentials: true,
  });
  return response.data;
};

export const updatePost = async (data) => {
  const response = await axios.put(UPDATE_POST_API_URL, data, {
    withCredentials: true,
  });
  return response.data;
};

export const deletePost = async (data) => {
  const response = await axios.post(DELETE_POST_API_URL, data, {
    withCredentials: true,
  });
  return response.data;
};
