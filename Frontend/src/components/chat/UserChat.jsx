import React from "react";
import { FaImage } from "react-icons/fa6";

export default function UserChat(props) {
    // const activeChat1 = props.activeChat;
    const profilePic =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="flex flex-col h-full p-6 ">
      {/* Chat header */}
      <div className="p-2   flex items-center  bg-[#333333] justify-center rounded-xl border border-white sticky rounded-lg">
        <img
          src={profilePic}
          alt=""
          className="w-14 h-14 rounded-full mr-3"
        />
        <p className="font-bold text-2xl">Vijay</p>
      </div>
      {/* Chat messages (could be dynamically rendered here) */}
      <div className="flex-1 bg-[#1A1A1A] p-4" ></div>
      {/* Message input */}
      <div className="flex  flex-row items-center rounded-b-lg xs:gap-2 xs:justify-between justify-center xs:w-full w-10 mx-auto">
        <button className=" rounded-full ">
          <span role="img" aria-label="Add Image">
            <FaImage className="text-5xl object-cover"/>
          </span>
        </button>
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 rounded bg-[#1A1A1A] border border-[#333333] text-white placeholder-gray-400 hover:border-white  "
        />
        
        <button className="p-2 bg-cyan-500 rounded text-white hover:bg-[#1A1A1A] text-cyan-500 font-bold ">SEND</button>
      </div>
    </div>
  );
}
