import axios from "axios";
import { chatEndpoints } from "./apisEndpoints";

const {
  CREATE_MESSAGE_API_URL,
  GET_ALL_CHAT_URL,
  GET_ALL_MESSAGES_URL
} = chatEndpoints;

// const API = axios.create({
//   baseURL: "http://localhost:5000/api", // Replace with your backend URL
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// Get all chats
export const getAllChats = async () => {
  const { data } = await axios.get(GET_ALL_CHAT_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",// Include auth if required
    },

    withCredentials: true,
  });
  return data.chats;
};

// Get messages for a specific chat
export const getAllMessages = async (id) => {
  const { data } = await axios.get(`${GET_ALL_MESSAGES_URL.replace(':id', id)}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",// Include auth if required
    }, withCredentials: true,
  });
  console.log("chatdata in chatAPi:", data);
  return data;
};

// Send a new message
export const sendMessage = async (receiverId, message) => {
  // const { data } = await API.post("/chat/", { receiverId, message });
  const { data } = await axios.post(CREATE_MESSAGE_API_URL, { receiverId, message }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },withCredentials: true,
  });
  console.log("chatdata:", data);

  return data.newMessage;
};
