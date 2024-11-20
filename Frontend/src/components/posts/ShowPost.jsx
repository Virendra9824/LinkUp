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

export default function ShowPost() {
  const profilePicLink =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const [addFriend, setAddFriend] = useState(true);
  const [countryName] = useState("India");
  const [profilePic] = useState(profilePicLink);
  const [postImage] = useState(profilePicLink);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [commentValue, setCommentValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState({});

  const [commentVisibility, setCommentVisibility] = useState({});
  const [optionsVisibility, setOptionsVisibility] = useState({});

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
      setAllPosts(data.allPosts);
    } catch (error) {
      console.log("Error while fetching posts: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
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
      setIsLiked(!isLiked);
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

  return (
    <div className="flex flex-col space-y-6">
      {loading && (
        <div className="flex justify-center">
          <div className="spinner-sm"></div>
        </div>
      )}

      {!loading &&
        allPosts?.map((post) => (
          <div
            key={post._id}
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
                  <h3 className="font-semibold text-sm md:text-lg">
                    {post.owner.name}
                  </h3>
                  <h6 className="text-sm text-gray-500">{countryName}</h6>
                </div>
              </div>
              {/* Add Friend Btn */}
              {/* <button
                  onClick={handleAddFriend}
                  className="p-2 bg-[#00353F] rounded-full flex items-center "
                >
                  {addFriend ? (
                    <MdOutlinePersonAdd size={28} className="text-[#3eacbb]" />
                  ) : (
                    <MdOutlinePersonRemove
                      size={28}
                      className="text-[#3eacbb]"
                    />
                  )}
                </button> */}

              {/* Three-Dots */}
              <div className="relative">
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
                  {isLiked ? (
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
                  <GoComment size={20} className="text-white" />{" "}
                  {post.comments.length || 0}
                </div>
              </div>
              <IoShareSocialOutline
                size={20}
                className="text-white cursor-pointer"
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
                      postId={post._id}
                      commentId={data._id}
                      username={data.user.name}
                      commentData={data.comment}
                      profilePic={data.user.profilePic.url}
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
