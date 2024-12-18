import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoChatbubblesSharp } from "react-icons/io5";
import UserChat from "../components/chat/UserChat";
import { getAllChats } from "../apis/chatApi";
import { useSelector } from "react-redux";
import { io } from 'socket.io-client';



const backEndUrl =`http://localhost:5000`;
export default function Chat() {
  const [followings, setFollowings] = useState([]); // Followings list
  const [activeChat, setActiveChat] = useState({}); // Active chat
  const [followingLoading, setFollowingLoading] = useState(false);

  const [chatloading, setChatLoading] = useState(false)

  const [currentUser, setCurrentUser] = useState({});

  const [allChats, setAllChats] = useState([]); // Store all chat data
  let chatId = null;

  const  [socket,setSocket] = useState(null);
  const [onlineUser,setOnlineUser] = useState([]);

  const [messages, setMessages] = useState([]);

  const [currentChatMessages, setCurrentChatMessages] = useState([]);

  

  // Redux state
  const loggedInUser = useSelector((state) => state.profile.user);
  

  const getFollowingsData = () => {
    setFollowingLoading(true);

    try {
      const { followers = [], followings: rawFollowings = [] } = loggedInUser || {};

      // Combine and remove duplicates based on _id
      const combinedFollowings = [...followers, ...rawFollowings];
      const uniqueFollowings = combinedFollowings.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u._id === user._id) // Ensure unique `_id`
      );
     

      setCurrentUser(loggedInUser);
     
      setFollowings(uniqueFollowings);
      console.log("Processed followings (unique):", uniqueFollowings);
    } catch (error) {
      console.error("Error while processing followings data:", error);
    } finally {
      setFollowingLoading(false);
    }
  };

  // UseEffect to fetch data on mount or when loggedInUser changes
  useEffect(() => {
    if (loggedInUser) {
      getFollowingsData();
      console.log("login user:", loggedInUser);
    }
  }, [loggedInUser]);

  // // Fetch all chats
  const fetchAllChats = async () => {
    setChatLoading(true)
    try {
      const response = await getAllChats();

      return response
      console.log("chatdata:", response)

    } catch (error) {
      console.error("Error while fetching chats:", error.message);
    }
    finally {
      setChatLoading(false)
    }
  };

  // Determine the `chatId` for the selected user
  const findChatId = (userId) => {

    if (!chatloading) {
      const chat = allChats.find((chat) =>
        chat.participants.some((participant) => participant._id === userId)
      );
      return chat?._id || null;;
    }

    // If chat exists, return its ID; otherwise, null
  };

// // console.log(allChats);
  // // console.log(currentuser);

  
  const handleActiveChat = (following) => {
    const chatId = findChatId(following._id); // Get chatId for the user

    const updatedChat = {
      ...following,
      chatId,
    };

    setActiveChat(updatedChat); // Update the state
    console.log("Updated active chat:", updatedChat);
    // console.log("active chat:", activeChat)
    
  };



  useEffect(() => {
    const fetchChats = async () => {
      const resultchat = await fetchAllChats();
      if (resultchat) {
        setAllChats(resultchat);
        console.log("all chat are:", resultchat)
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    const socket= io(backEndUrl,{
      query:{
      userId: currentUser?._id,
      },
    });
    
    setSocket(socket);

    socket.on("getOnlineUser",(users)=>{
      setOnlineUser(users);

    })

    

    socket.on("newMessage", (message) => {
      console.log("Received new message:", message);
  
      // Check if the message is part of the current active chat
      if (activeChat.chatId === message.chatId) {
        // Update the messages state to include the new message
        setMessages((prevMessages) => [...prevMessages, message]);
      }


  
      // Update the active chat's latest message if it belongs to the active chat
      setActiveChat((prev) => {
        console.log("Previous active chat:", prev);
  
        if (!prev || !prev.chatId) {
          console.error("Active chat is not defined:", prev);
          return prev;
        }
  
        if (prev.chatId === message.chatId) {
          return {
            ...prev,
            latestMessage: {
              content: message.content,
              sender: message.senderId,
            },
          };
        }
  
        // Return previous chat if the message is from a different chat
        return prev;
      });
    });
  
     

    console.log(onlineUser,"online user")
    return () => {
     
      socket.off("newMessage"); // Cleanup the socket listener on unmount
      socket.disconnect(); // Ensure socket disconnects on component unmount
      socket && socket.close();
    };
  }, [currentUser,activeChat]);



  return (
    
    <div className="bg-[#0A0A0A] min-h-screen">
      <div className="w-[90%] mx-auto flex md:flex-row flex-col justify-between gap-8 rounded-l bg-[#1A1A1A] min-h-[560px] my-6">
        {/* Sidebar */}
        <div className="md:w-1/4 p-6 w-full flex flex-col mx-auto">
          {/* Search bar */}
          <div className="mb-4 flex items-center bg-[#333333] justify-evely rounded-xl">
            <input
              type="text"
              placeholder="Search your friends..."
              className="w-[80%] p-2 text-white rounded-xl bg-[#333333] placeholder-gray-400 focus:outline-none"
            />
            <IoIosSearch className="text-2xl mx-auto" />
          </div>

          {/* Followings list */}
          <div className="w-[95%] mx-auto overflow-y-auto max-h-[400px]">
            {followingLoading ? (
              <p className="text-gray-400 text-center">Loading followings...</p>
            ) : followings.length > 0 ? (
              followings.map((following) => (
                <div
                  key={following._id}
                  className="flex items-center w-full p-2 mb-2 rounded-xl bg-[#333333] cursor-pointer"
                  onClick={() => handleActiveChat(following)}
                >
                  <div className="w-10 h-10 bg-gray-500 rounded-full mr-3">
                    <img
                      src={following.profilePic?.url || "https://via.placeholder.com/150"}
                      alt={`${following.firstName} ${following.lastName}`}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {following.firstName} {following.lastName}
                    </p>
                    {/* <p className="text-sm text-gray-400">Open chat to see messages</p> */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No followings found</p>
            )}
          </div>
        </div>

        {/* Main Chat Window */}
        <div className="md:flex-1 flex flex-col">
          {Object.keys(activeChat).length !== 0 ? (
            <UserChat 
            activeChat={activeChat}
            currentUser={currentUser} chatId={chatId} allChats={allChats} setActiveChat={setActiveChat}
              onlineUser={onlineUser} socket={socket} messages={messages} setMessages={setMessages} currentChatMessages={currentChatMessages} setCurrentChatMessages={setCurrentChatMessages}
            />
          ) : (
            <div className="flex-1 flex-col items-center justify-center md:flex hidden">
              <div className="text-3xl font-semibold text-blue-300 hover:text-[#333333]">
                Open Your Chat Box to communicate with your friend
              </div>
              <div className="text-6xl text-gray-600 mt-4">
                <IoChatbubblesSharp className="text-15xl" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}