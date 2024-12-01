import React, { useEffect, useState } from "react";
import ShowPost from "./ShowPost";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserByID } from "../../apis/userApi";

export default function UserSpecificPosts() {
  const { postId, userId } = useParams();
  const [userPosts, setUserPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let index = queryParams.get("index");
  index = index - 1;

  useEffect(() => {
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
  }, [userId]);

  return (
    <div className="w-[100%] lg:py-4 md:w-[80%] lg:w-[55%] mx-auto">
      {loading ? (
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      ) : user ? ( // Render only if `user` is not null
        <>
          {user.posts?.length > 0 ? (
            <ShowPost postIndex={index} userPosts={user.posts} />
          ) : (
            <div className="text-sm italic font-semibold text-gray-400 text-center">
              No posts found!.
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500">Posts not available</div>
      )}
    </div>
  );
}
