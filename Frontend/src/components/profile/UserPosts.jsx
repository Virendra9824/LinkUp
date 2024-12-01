import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserPosts = ({ posts }) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post, index) => (
        <Link
          to={`posts/${post._id}?index=${index + 1}`}
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
