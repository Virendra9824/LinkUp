import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { deleteComment } from "../../apis/postApi";

export default function CommentCard(props) {
  let { username, commentData, profilePic, postId, commentId } = props;
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);

  let handleDeleteComment = async (postId) => {
    try {
      setDeleteCommentLoading(true);
      const response = await deleteComment({ postId, commentId });
      console.log(response.message);
      // Refresh the comments after deletion
    } catch (error) {
      console.error("Error deleting comment:", error);
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
          <span className="text-gray-200 font-semibold">{username}</span>
          <span className="text-gray-400 text-sm">{commentData}</span>
        </div>
        <button
          onClick={() => handleDeleteComment(postId)}
          disabled={deleteCommentLoading}
          className="ml-auto text-gray-100 hover:text-red-500"
        >
          <MdOutlineDelete size={22} />
        </button>
      </div>
    </div>
  );
}
