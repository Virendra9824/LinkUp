import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoChatbubblesSharp } from "react-icons/io5";
import UserChat from "../components/chat/UserChat";
import { getFollowings } from "../apis/userApi";
export default function Chat() {
  const friends = [
    { name: "Deepika Bajaj", status: "Open chat to see messages" },
    { name: "Vijay Kumar", status: "Open chat to see messages" },
    { name: "Vaibhav Sachdeva", status: "Open chat to see messages" },
  ];

  const [activeChat, setActiveChat] = useState(true);
  const [loading, setLoading] = useState(false);

  let getFollowingsData = async () => {
    setLoading(true); // Set loading state
    try {
      // AI-ML: INTEGRATED login FUNCTION FROM authApi.js
      const response = await getFollowings();

      // Redirect to home page

      console.log("Followings Data is:", response);
    } catch (error) {
      console.error(
        "Error while getting followings data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    getFollowingsData();
  }, []);

  const profilePic =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="bg-[#0A0A0A] ">
      <div className="w-[90%]   mx-auto flex  md:flex-row flex-col justify-between gap-8 rounded-l bg-[#1A1A1A] min-h-[560px] my-6  ">
        {/* Sidebar */}
        <div className="md:w-1/4 p-6 w-full flex flex-col mx-auto  ">
          {/* Search bar */}
          <div className="mb-4 flex  items-center bg-[#333333] justify-evely rounded-xl ">
            <input
              type="text"
              placeholder="Search your friends..."
              className="w-[80%] p-2   text-white rounded-xl bg-[#333333] placeholder-gray-400 focus:outline-none"
            />
            <IoIosSearch className="text-2xl mx-auto" />
          </div>
          {/* Friends list */}
          <div className=" w-[95%]  mx-auto">
            {friends.map((friend, index) => (
              <div
                key={index}
                className="flex items-center   w-full p-2 mb-2 rounded-xl bg-[#333333]  cursor-pointer rounded-lg "
              >
                <div className="w-10 h-10 bg-gray-500 rounded-full mr-3">
                  <img
                    src={profilePic} // Replace with actual user profile image URL
                    alt="User 1"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold hover:text-[#333333]">
                    {friend.name}
                  </p>
                  <p className="text-sm text-gray-400">{friend.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Window */}

        <div className="md:flex-1 flex flex-col  ">
          {activeChat ? (
            <UserChat />
          ) : (
            <div className="flex-1  flex-col items-center justify-center md:flex hidden ">
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
