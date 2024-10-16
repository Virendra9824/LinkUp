import React from "react";
import { IoPersonAddOutline } from "react-icons/io5";
export default function SingleUser() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/snap-it-vaibhav.appspot.com/o/1691574321851vbv%20dp.jpeg?alt=media&token=ad848919-3e13-469b-b308-1231181daf84" // Replace with actual user profile image URL
            alt="User 1"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">Vaibhav Sachdeva</p>
            <p className="text-sm text-gray-400">Software Developer</p>
          </div>
        </div>
        <button className=" p-4 rounded-full">
          <span className=" text-white">
            <IoPersonAddOutline className="text-2xl" />
          </span>
        </button>
      </div>
    </div>
  );
}
