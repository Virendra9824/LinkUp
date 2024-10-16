import React, { useState } from "react";
import { BsEmojiSunglasses } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineGifBox } from "react-icons/md";
import { MdOutlineAttachFile } from "react-icons/md";
import { AiTwotoneAudio } from "react-icons/ai";

export default function CreatePost() {
  const [showImageArea, setShowImageArea] = useState(false); // STATE FOR IMAGE AREA
  const profilePic =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  // FUNCTION TO TOGGLE IMAGE AREA
  const handleImageButtonClick = () => {
    setShowImageArea(!showImageArea); // TOGGLE THE IMAGE AREA VISIBILITY
  };

  return (
    <div className="bg-[#1A1A1A] h-fit px-4 xs:px-6 py-4 rounded-lg">
      {/* Upper Section */}
      <div className="flex gap-x-4 items-center">
        {/* Profile Image */}
        <img
          src={profilePic}
          alt="profile"
          className="rounded-full w-9  md:w-12  object-cover aspect-square"
        />
        {/* Input Text */}
        <input
          type="text"
          placeholder="What's on your mind..."
          className="flex-grow bg-[#333333] text-white focus:outline-none px-4 xs:px-8 text-sm py-2 md:py-4 rounded-full"
        />
        {/* Emoji Button */}
        <div className=" hidden xs:block border border-[#00D5FA] rounded-sm py-2 px-3 text-white cursor-pointer">
          <BsEmojiSunglasses color="#00D5FA" />
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="border rounded-md flex items-center justify-center border-[#343434] my-5">
        {/* Conditional Image Upload Area */}
        {showImageArea && (
          <div className="m-4 p-4 w-full border-2 border-dashed border-[#00D5FA] text-center text-gray-400">
            Add Image Here
          </div>
        )}
      </div>

      {/* Lower Section */}
      <div className="flex items-center gap-x-4 justify-between">
        {/* Icon-Btns */}
        <div className="flex gap-x-4 text-gray-400">
          <button
            className="flex items-center"
            onClick={handleImageButtonClick}
          >
            <CiImageOn />
            <span className="ml-1">Image</span>
          </button>
          <button className="items-center hidden md:flex">
            <MdOutlineGifBox />
            <span className="ml-1">Clip</span>
          </button>
          <button className="flex items-center  hidden md:flex">
            <MdOutlineAttachFile />
            <span className="ml-1">Attachment</span>
          </button>
          <button className="flex items-center  hidden md:flex">
            <AiTwotoneAudio />
            <span className="ml-1">Audio</span>
          </button>
        </div>
        {/* Post Button */}
        <button className="bg-[#00D5FA] text-black font-semibold rounded-full px-4 py-1">
          POST
        </button>
      </div>
    </div>
  );
}
