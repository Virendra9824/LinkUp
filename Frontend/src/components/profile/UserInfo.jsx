import React, { useState } from "react";
import toast from "react-hot-toast";
import { BsThreeDots } from "react-icons/bs";
import { RiSettings3Line } from "react-icons/ri";
import { followUnfollowReqest } from "../../apis/userApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UserInfo({ user, isLoggedInUser }) {
  const [loading, setLoading] = useState(false);
  const loggedInUser = useSelector((state) => state.profile.user);
  const isFriend = user.followers.includes(loggedInUser?._id);

  const handleAddFriend = async (userId, userName) => {
    setLoading(true);
    try {
      const response = await followUnfollowReqest(userId);
      toast.success(`${userName} ${isFriend ? "Unfollowed" : "Followed"}`);
    } catch (error) {
      console.log("Error while Follow/UnFollow: ", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col sm:flex-row w-[90%] mx-auto  items-center text-white p-6 space-y-4 sm:space-y-0 sm:space-x-4 rounded-lg">
      {/* Profile Picture */}
      <div className="relative w-24 h-24 sm:w-36 sm:h-36 mx-auto sm:mx-0">
        <img
          className="rounded-full border-2 border-gray-600 object-cover w-full aspect-square"
          src={user?.profilePic?.url}
          alt="Profile"
        />
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-y-4 sm:ps-6 text-center sm:text-left">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-4">
          {/* Unique userName */}
          <h1 className="text-lg font-semibold">{user.userName}</h1>
          {/* Action Buttons */}
          <div className="flex justify-center sm:justify-between w-full sm:w-auto space-x-4">
            <Link
              to={"/update-profile"}
              className={`${
                !isLoggedInUser ? "hidden" : ""
              } py-1 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700`}
            >
              Edit Profile
            </Link>
            <button
              disabled={loading}
              onClick={() => handleAddFriend(user._id, user.firstName)}
              className={`${
                isLoggedInUser ? "hidden" : ""
              } py-1 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700`}
            >
              {isFriend ? "Unfollow" : "Follow"}
            </button>
            <Link
              to={`/chat/${user._id}`}
              className={`${
                isLoggedInUser ? "hidden" : ""
              } py-1 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700`}
            >
              Message
            </Link>
            <Link
              to={"/"}
              className={`${
                !isLoggedInUser ? "hidden" : ""
              } py-1 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700`}
            >
              Add Post
            </Link>
            <button className="text-white">
              {isLoggedInUser ? <RiSettings3Line size={22} /> : <BsThreeDots />}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex justify-center sm:justify-start gap-x-8 w-full text-center text-sm">
          <div className="flex gap-x-1">
            <h2 className="font-bold">{user.posts.length}</h2>
            <span className="text-gray-400">posts</span>
          </div>
          <div className="flex gap-x-1">
            <h2 className="font-bold">{user.followers.length}</h2>
            <span className="text-gray-400">followers</span>
          </div>
          <div className="flex gap-x-1">
            <h2 className="font-bold">{user.followings.length}</h2>
            <span className="text-gray-400">following</span>
          </div>
        </div>

        {/* About Section */}
        <div className="text-sm">
          <h2 className="font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-400">
            {user.role === "student"
              ? "Student"
              : user.role === "teacher"
              ? "Teacher"
              : "Personnel"}
          </p>
          <p className="text-gray-200 italic">
            {user?.bio ? user?.bio : "Login again."}
          </p>
        </div>
      </div>
    </div>
  );
}
