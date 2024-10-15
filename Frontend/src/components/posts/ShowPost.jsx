import React, { useState } from "react";
import { MdOutlinePersonAdd, MdOutlinePersonRemove } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { GoComment } from "react-icons/go";
import CommentCard from "./CommentCard";
import { MdOutlineDelete } from "react-icons/md";

export default function ShowPost() {
  const profilePic =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  let [addFriend, setAddFriend] = useState(true);
  let [isLiked, setIsLiked] = useState(false);
  let [showComments, setShowComments] = useState(false);

  let handleAddFriend = () => {
    setAddFriend(!addFriend);
  };

  let handleLike = () => {
    setIsLiked(!isLiked);
  };

  let handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="bg-[#1A1A1A] h-fit px-6 py-4 flex flex-col gap-y-4 rounded-lg">
      {/* User-Info */}
      <div className="flex justify-between items-center gap-x-32">
        <div className="flex gap-x-2 justify-center items-center">
          {/* img */}
          <img
            src={profilePic}
            alt="profile"
            className="rounded-full w-12 h-12 object-cover"
          />
          {/* Name and Country */}
          <div className="flex flex-col text-gray-200">
            <h3 className="font-semibold text-sm md:text-lg">Narendra Modi</h3>
            <h6 className="text-sm text-gray-500">India</h6>
          </div>
        </div>
        {/* Add Friend Btn */}
        <button
          onClick={handleAddFriend}
          className="p-2 bg-[#00353F] rounded-full flex items-center "
        >
          {addFriend ? (
            <MdOutlinePersonAdd size={28} className="text-[#3eacbb]" />
          ) : (
            <MdOutlinePersonRemove size={28} className="text-[#3eacbb]" />
          )}
        </button>
      </div>

      {/* Post-content */}
      <div className="text-sm text-gray-200">Hy, I looks like Hynnah Baker</div>

      {/* Post-Image */}
      <div>
        <img
          src={profilePic}
          alt="profile"
          className="w-full h-96 rounded-md"
        />
      </div>

      {/* Like-Comment-Share */}
      <div className="py-2 flex justify-between">
        {/* Like-Comment */}
        <div className="flex gap-x-5">
          {/* Like */}
          <div
            onClick={handleLike}
            className="flex gap-x-1 items-center text-md cursor-pointer"
          >
            {isLiked ? (
              <IoIosHeart size={20} className="text-[#00D5FA]" />
            ) : (
              <IoIosHeartEmpty size={20} className="text-white" />
            )}{" "}
            3
          </div>
          {/* Comment */}
          <div
            onClick={handleToggleComments}
            className="flex gap-x-1 items-center text-md cursor-pointer"
          >
            <GoComment size={20} className="text-white" /> 5
          </div>
        </div>
        {/* Share-icon */}
        <div>
          <IoShareSocialOutline
            size={20}
            className="text-white cursor-pointer"
          />
        </div>
      </div>

      {/* Comment-Section-Open/Close */}
      {showComments && (
        <div className="border-t border-gray-700 mt-2 pt-2">
          {/* Display existing comments */}
          <div className="flex flex-col gap-y-1">
            <CommentCard
              username={"Bhavesh Kumawat"}
              commentData={"Very Nice Post!"}
              profilePic={profilePic}
            />
            <CommentCard
              username={"Aman Joshi"}
              commentData={"Nailed it!"}
              profilePic={profilePic}
            />
          </div>

          {/* Add comment input */}
          <div className="flex items-center gap-x-2 mt-4">
            <button className="w-10 h-10 px-2 py-1 bg-blue-500 rounded-lg flex items-center justify-center text-lg">
              😊
            </button>
            <input
              type="text"
              placeholder="Add your comment here"
              className="w-full bg-[#1A1A1A] border border-gray-600 p-2 rounded-lg text-white focus:outline-none"
            />
            <button className="px-4 py-2 bg-[#00D5FA] rounded-lg text-black font-semibold">
              POST
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
