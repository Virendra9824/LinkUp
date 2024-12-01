import React, { useEffect, useState } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { GoComment } from "react-icons/go";
import CommentCard from "./CommentCard";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  commentOnPost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
} from "../../apis/postApi";
import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import toast from "react-hot-toast";
import { followUnfollowReqest } from "../../apis/userApi";

export default function ShowPost({ userPosts, postIndex }) {
  const profilePicLink =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const [addFriend, setAddFriend] = useState(true);
  const [countryName] = useState("India");
  const [profilePic] = useState(profilePicLink);
  const [postImage] = useState(profilePicLink);
  // const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [commentValue, setCommentValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState({});

  const [commentVisibility, setCommentVisibility] = useState({});
  const [optionsVisibility, setOptionsVisibility] = useState({});

  const loggedInUser = useSelector((state) => state.profile.user);
  const currentUserId = loggedInUser?._id;

  const onEmojiClick = (emojiData) => {
    setCommentValue((prevInput) => prevInput + emojiData.emoji);
  };

  const handleToggleEmojiPicker = (postId) => {
    setShowEmojiPicker((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts();
      console.log("Posts Fetched Successfully: ", data);
      const updatedPosts = data.allPosts.map((post) => ({
        ...post,
        isLiked: post.likes.includes(currentUserId),
        isFriend: post.owner?.followers?.includes(currentUserId) || false,
      }));
      setAllPosts(updatedPosts);
    } catch (error) {
      console.log("Error while fetching posts: ", error);
    } finally {
      setLoading(false);
    }
  };

  //  **** FETCH POSTS ****
  useEffect(() => {
    if (!userPosts) {
      fetchAllPosts();
    } else {
      const updatedPosts = userPosts.map((post) => ({
        ...post,
        isLiked: post.likes.includes(currentUserId),
        isFriend: post.owner?.followers?.includes(currentUserId) || false,
      }));
      setAllPosts(updatedPosts);
    }
  }, []);

  const handleCreateComment = async (postId) => {
    try {
      setCommentLoading(true);
      await commentOnPost({ comment: commentValue, postId });
    } catch (error) {
      console.log("Error while creating comment: ", error);
    } finally {
      setCommentLoading(false);
      setCommentValue("");
    }
  };

  const handleToggleComments = (postId) => {
    setCommentVisibility((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const toggleOptions = (postId) => {
    setOptionsVisibility((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleLikeUnlike = async (postId) => {
    try {
      setLikeLoading(true);
      await likeUnlikePost({ postId });
      // setIsLiked(!isLiked);
      setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, isLiked: !post.isLiked } : post
        )
      );
    } catch (error) {
      console.log("Error while LikeUnlike: ", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      setLoading(true);
      const response = await deletePost({ postId });
      console.log(response.message);
    } catch (error) {
      console.log("Error while Deleting post: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareButton = (postId) => {
    const postUrl = `${window.location.href.replace(
      /\/$/,
      ""
    )}/posts/${postId}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard!");
      });
  };

  const handleAddFriend = async (isFriend, userId, userName) => {
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

  // To scroll to a specified index or position.
  const postRefs = useRef([]);
  useEffect(() => {
    if (
      postIndex &&
      postIndex >= 0 &&
      postIndex < allPosts.length &&
      postRefs.current[postIndex]
    ) {
      postRefs.current[postIndex].scrollIntoView({ behavior: "smooth" });
    }
  }, [postIndex, allPosts]);

  return (
    <div className="flex flex-col space-y-6">
      {loading && (
        <div className="flex justify-center">
          <div className="spinner-sm"></div>
        </div>
      )}

      {!loading &&
        allPosts?.map((post, index) => (
          <div
            key={post._id}
            ref={(el) => (postRefs.current[index] = el)}
            className="bg-[#1A1A1A] h-fit px-4 xs:px-6 py-4 flex flex-col gap-y-4 rounded-lg"
          >
            {/* User-Info */}
            <div className="flex justify-between items-center">
              <div className="flex gap-x-2 items-center">
                <img
                  src={post.owner.profilePic.url || profilePic}
                  alt="profile"
                  className="rounded-full w-10 md:w-12 object-cover aspect-square"
                />
                <div className="flex flex-col text-gray-200">
                  <Link
                    to={`/user/${post.owner._id}`}
                    className="font-semibold text-sm md:text-lg"
                  >
                    {post.owner.firstName} {post.owner.lastName}
                  </Link>
                  <h6 className="text-sm text-gray-500">{countryName}</h6>
                </div>
              </div>
              {/* Follow-Unfollow Btn */}
              <button
                disabled={loading}
                onClick={() =>
                  handleAddFriend(
                    post.isFriend,
                    post.owner._id,
                    post.owner.firstName
                  )
                }
                className={`${
                  currentUserId === post.owner._id ? "hidden" : ""
                }  py-1 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700`}
              >
                {post.isFriend ? "Unfollow" : "Follow"}
              </button>

              {/* Three-Dots for loggedInUser Posts */}
              <div
                className={`relative ${
                  currentUserId !== post.owner._id ? "hidden" : ""
                }`}
              >
                <BsThreeDotsVertical
                  size={28}
                  className="text-[#3eacbb] cursor-pointer"
                  onClick={() => toggleOptions(post._id)}
                />
                {optionsVisibility[post._id] && (
                  <div className="absolute bg-gray-700 text-gray-100 shadow-lg rounded-md mt-2 py-2 w-40 right-0">
                    <button
                      onClick={() => console.log("Update post", post._id)}
                      className="block px-4 py-2 text-sm hover:bg-gray-600"
                    >
                      Update Caption
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="block px-4 py-2 text-sm hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Post-content */}
            <div className="text-sm text-gray-200">{post.caption}</div>
            <img
              src={post.media.url || postImage}
              alt="post"
              className="w-full h-72 xs:h-96 rounded-md"
            />

            {/* Like-Comment-Share */}
            <div className="py-2 flex justify-between">
              <div className="flex gap-x-5">
                <div
                  onClick={
                    !likeLoading ? () => handleLikeUnlike(post._id) : null
                  }
                  className={`flex gap-x-1 items-center text-md cursor-pointer ${
                    likeLoading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {post.isLiked ? (
                    <IoIosHeart size={20} className="text-[#00D5FA]" />
                  ) : (
                    <IoIosHeartEmpty size={20} className="text-white" />
                  )}{" "}
                  {post.likes.length || 0}
                </div>
                <div
                  onClick={() => handleToggleComments(post._id)}
                  className="flex gap-x-1 items-center text-md cursor-pointer"
                >
                  <GoComment
                    size={20}
                    className={`hover:text-[#00D5FA] ${
                      commentVisibility[post._id]
                        ? "text-[#00D5FA]"
                        : "text-white "
                    }`}
                  />{" "}
                  {post.comments.length || 0}
                </div>
              </div>
              <IoShareSocialOutline
                onClick={() => handleShareButton(post._id)}
                size={20}
                className="text-white cursor-pointer hover:text-[#00D5FA]"
              />
            </div>

            {/* Comment Section */}
            {commentVisibility[post._id] && (
              <div className="border-t border-gray-700 mt-2 pt-2">
                <div className="flex flex-col gap-y-1">
                  {!commentLoading && post.comments.length === 0 && (
                    <div className="pl-2 text-xs italic text-gray-400">
                      Comment box is empty.
                    </div>
                  )}
                  {post.comments.map((data) => (
                    <CommentCard
                      key={data._id}
                      postOwnerId={post.owner._id}
                      postId={post._id}
                      commentId={data._id}
                      firstName={data.user.firstName}
                      lastName={data.user.lastName}
                      commentData={data.comment}
                      profilePic={data.user.profilePic.url}
                      userId={data.user._id}
                      currentUserId={currentUserId}
                    />
                  ))}
                </div>
                <div className="relative">
                  <div className="flex items-center gap-x-2 mt-4">
                    <button
                      onClick={() => handleToggleEmojiPicker(post._id)}
                      className="w-10 h-10 px-2 py-1 bg-blue-500 rounded-lg hidden xs:flex justify-center items-center text-lg"
                    >
                      😊
                    </button>
                    {showEmojiPicker[post._id] && (
                      <div className="absolute top-12 z-10">
                        <EmojiPicker
                          width={370}
                          height={370}
                          onEmojiClick={onEmojiClick}
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      onChange={(e) => setCommentValue(e.target.value)}
                      value={commentValue}
                      placeholder="Add your comment here"
                      className="rounded-lg px-4 py-2 h-10 text-sm w-full bg-gray-600 text-gray-200 outline-none"
                    />
                    <button
                      onClick={
                        commentValue && !commentLoading
                          ? () => handleCreateComment(post._id)
                          : null
                      }
                      className={`rounded-lg px-4 py-2 h-10 w-20 flex justify-center items-center text-sm text-gray-200 bg-[#2DC5EA] hover:bg-[#00D5FA] transition-all ${
                        commentValue && !commentLoading
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                    >
                      {commentLoading ? (
                        <div className="spinner-sm"></div>
                      ) : (
                        "Post"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
