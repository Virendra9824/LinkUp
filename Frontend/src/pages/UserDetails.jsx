import React, { useEffect, useState } from "react";
import UserPosts from "../components/profile/UserPosts";
import UserInfo from "../components/profile/UserInfo";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getUserByID } from "../apis/userApi";

export default function UserDetails() {
  let { userId } = useParams();
  let loggedInUser = useSelector((state) => state.profile.user);
  let isLoggedInUser = userId === loggedInUser?._id;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedInUser) {
      setUser(loggedInUser);
    } else {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await getUserByID(userId);
          setUser(response.user);
        } catch (error) {
          console.log("Error while getting user giveId as:  ", error);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId, loggedInUser, isLoggedInUser]);

  return (
    <div className="w-[100%] lg:w-[65%] mx-auto space-y-8 border-4 border-emerald-600 min-h-screen">
      {/* User-Info */}
      {loading ? (
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      ) : user ? ( // Render only if `user` is not null
        <>
          <UserInfo isLoggedInUser={isLoggedInUser} user={user} />

          <div className=" border-b border-gray-500"></div>

          {/* User-Posts */}
          {user.posts?.length > 0 ? (
            <UserPosts posts={user.posts} />
          ) : (
            <div className="text-sm italic font-semibold text-gray-400 text-center">
              No posts uploaded yet!
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500">User data not available</div>
      )}
    </div>
  );
}
