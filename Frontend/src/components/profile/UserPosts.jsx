import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const UserPosts = () => {
  let { userId } = useParams();

  const { posts } = useSelector((state) => state.post);
  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    setUserPosts(posts.filter((post) => post.owner._id == userId));
  }, [userId]);

  return (
    <div className="grid grid-cols-3 gap-1">
      {userPosts.map((post, index) => (
        <Link
          to={`posts/${post._id}?index=${index + 1}`}
          // INDEX in reverse order -> index=${userPosts.length - index}
          key={index}
          className="relative group aspect-square w-full"
        >
          {/* Image */}
          <img
            className="aspect-square w-full object-cover"
            src={post.media.url}
            alt={`Image${index + 1}`}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Likes */}
            <div className="flex items-center text-white text-lg mb-2">
              <FcLike className="mr-2" />
              {post.likes.length}
            </div>
            {/* Comments */}
            <div className="flex items-center text-white text-lg">
              <FaComment className="mr-2" />
              {post.comments.length}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserPosts;
