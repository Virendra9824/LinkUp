import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { deleteComment } from "../../apis/postApi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function CommentCard(props) {
  let {
    firstName,
    lastName,
    commentData,
    profilePic,
    postId,
    commentId,
    userId,
    currentUserId,
    postOwnerId,
  } = props;
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);

  let handleDeleteComment = async (postId) => {
    try {
      setDeleteCommentLoading(true);
      const response = await deleteComment({ postId, commentId });
      console.log(response.message);
      toast.success(response.message);
      // Refresh the comments after deletion
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error in deleting comment.");
    } finally {
      setDeleteCommentLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-x-3 items-center">
        <img
          src={profilePic}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <Link to={`/user/${userId}`} className="text-gray-200 font-semibold">
            {firstName} {lastName}
          </Link>
          <span className="text-gray-400 text-sm">{commentData}</span>
        </div>
        <button
          onClick={() => handleDeleteComment(postId)}
          disabled={deleteCommentLoading}
          className={`${
            userId !== currentUserId && currentUserId !== postOwnerId
              ? "hidden"
              : ""
          } ml-auto text-gray-100 hover:text-red-500`}
        >
          <MdOutlineDelete size={22} />
        </button>
      </div>
    </div>
  );
}
