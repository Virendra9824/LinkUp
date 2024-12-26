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
  updatePost,
} from "../../apis/postApi";
import EmojiPicker from "emoji-picker-react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import toast from "react-hot-toast";
import { followUnfollowReqest } from "../../apis/userApi";
import {
  deletePostFromPosts,
  likeUnlikePostRedux,
  setPosts,
  updateCaptionFromPosts,
  updateComment,
  updateFollowers,
  updateIsFriend,
} from "../../redux/slices/postSlice";
import { updateFollowings } from "../../redux/slices/profileSlice";

export default function ShowPost({ userPosts, postIndex }) {
  const profilePicLink =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const [countryName] = useState("India");
  const [profilePic] = useState(profilePicLink);
  const [postImage] = useState(profilePicLink);
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

  const { userId } = useParams();

  const dispatch = useDispatch();

  const onEmojiClick = (emojiData) => {
    setCommentValue((prevInput) => prevInput + emojiData.emoji);
  };

  const handleToggleEmojiPicker = (postId) => {
    setShowEmojiPicker((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  // **************************
  //  **** FETCH POSTS start ****
  const { posts: postsFromRedux } = useSelector((state) => state.post);

  // Fetch all posts from the backend
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts();
      const updatedPosts = data.allPosts.map((post) => ({
        ...post,
        isLiked: post.likes.includes(currentUserId),
        likesCount: post.likes.length,
        isFriend: loggedInUser?.followings?.includes(post.owner?._id) || false,
      }));
      setAllPosts(updatedPosts);
      dispatch(setPosts(updatedPosts));
    } catch (error) {
      console.error("Error while fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts on initial mount
  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Prepare the posts to render
  const filteredPosts = userId
    ? postsFromRedux.filter((post) => post.owner._id === userId)
    : postsFromRedux;

  // const postsToRender = filteredPosts.map((post) => ({
  //   ...post,
  //   isLiked: post.likes.includes(currentUserId),
  //   likesCount: post.likes.length,
  // }));

  const postsToRender = filteredPosts;

  // **************************
  //  **** FETCH POSTS end ****

  const handleAddFriend = async (isFriend, userId, userName) => {
    // setLoading(true);
    try {
      const response = await followUnfollowReqest(userId);
      const { updatedUserFollowings, targetUserFollowers } = response;

      toast.success(`${userName} ${response?.result}`);
      // console.log("Response of follow/Unfollow-Request: ", response);

      // Update isFriend status in posts
      dispatch(
        updateIsFriend({
          userId,
          isFriend: response?.result === "Followed" ? true : false,
        })
      );

      isFriend = response?.result === "Followed" ? true : false;

      // Update Followers of target user.
      dispatch(updateFollowers({ userId, targetUserFollowers, isFriend }));

      // Update logged-in user's followings
      dispatch(updateFollowings(updatedUserFollowings));
    } catch (error) {
      console.log("Error while Follow/UnFollow: ", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (postId) => {
    try {
      setCommentLoading(true);

      const response = await commentOnPost({ comment: commentValue, postId });
      const updatedComment = response?.newComment;

      dispatch(updateComment({ postId, updatedComment }));
      // console.log("postsFromRedux After comment: ", postsFromRedux);
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
      const response = await likeUnlikePost({ postId });

      // console.log("Response of likeUnlike: ", response);

      dispatch(
        likeUnlikePostRedux({
          postId: response.postId,
          likesCount: response.likesCount,
          isLiked: response.isLiked,
          likes: response.likes,
        })
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
      dispatch(deletePostFromPosts({ postId }));
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

  // To SCROLL to a specified index or position.
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

  // ****** UPDATE CAPTION start ******:
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedCaption, setUpdatedCaption] = useState("");
  const [captionPostId, setCaptionPostId] = useState("");

  const handleUpdateCaptionApi = async () => {
    try {
      if (!updatedCaption) throw new Error("Caption is required!");
      const response = await updatePost({
        postId: captionPostId,
        caption: updatedCaption,
      });
      toast.success("Caption updated successfully!");
      dispatch(
        updateCaptionFromPosts({ postId: captionPostId, updatedCaption })
      );
      setUpdatedCaption("");
    } catch (error) {
      toast.error("Error updating caption");
      console.log("Error while updating caption: ", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleUpdateCaption = async (postId, currentCaption) => {
    setCaptionPostId(postId);
    setUpdatedCaption(currentCaption);
    setIsModalOpen(!isModalOpen);
  };

  // ****** UPDATE CAPTION End******

  return (
    <div className="flex flex-col space-y-6 min-h-screen">
      {loading && (
        <div className="flex justify-center">
          <div className="spinner-sm"></div>
        </div>
      )}

      {!loading &&
        postsToRender?.map((post, index) => (
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
              {/* Follow - Unfollow Btn */}
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
                  <div className="absolute px-2 bg-[rgba(10,10,10,0.8)] text-gray-200 shadow-lg rounded-md mt-2 py-2 w-40 right-0">
                    <button
                      onClick={() => {
                        setCaptionPostId(post._id);
                        handleUpdateCaption(post._id, post.caption);
                      }}
                      className="block px-1 rounded-t-sm py-2 border-b text-sm hover:bg-gray-600 w-full text-left"
                    >
                      Update Caption
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="block px-1 rounded-b-sm py-2 text-sm hover:bg-gray-600 w-full text-left"
                    >
                      Delete Post
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
                  {post.likesCount || 0}
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

      {/* Update-Caption Modal */}
      {isModalOpen && (
        <>
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
              <h2 className="text-lg font-bold text-gray-100 mb-4">
                Edit Caption
              </h2>
              <textarea
                value={updatedCaption}
                onChange={(e) => setUpdatedCaption(e.target.value)}
                rows="3"
                className="w-full p-3 border border-gray-600 rounded bg-[#2A2A2A] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCaptionApi}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          ></div>
        </>
      )}
    </div>
  );
}
