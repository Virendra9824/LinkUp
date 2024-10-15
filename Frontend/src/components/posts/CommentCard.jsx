import React from "react";
import { MdOutlineDelete } from "react-icons/md";

export default function CommentCard(props) {
  let { username, commentData, profilePic } = props;
  return (
    <div>
      <div className="flex gap-x-3 items-center">
        <img
          src={profilePic}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-gray-200 font-semibold">{username}</span>
          <span className="text-gray-400 text-sm">{commentData}</span>
        </div>
        <button className="ml-auto text-gray-100 hover:text-red-500">
          <MdOutlineDelete size={22} />
        </button>
      </div>
    </div>
  );
}
