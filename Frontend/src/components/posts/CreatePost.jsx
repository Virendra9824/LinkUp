import React, { useState } from "react";
import { BsEmojiSunglasses } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import ImageUploader from "../common/ImageUploader";
import { createPost } from "../../apis/postApi";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addNewPost } from "../../redux/slices/postSlice";
import { setNewPostToUser } from "../../redux/slices/profileSlice";

export default function CreatePost() {
  const [showImageArea, setShowImageArea] = useState(false); // STATE FOR IMAGE AREA
  const loggedInUser = useSelector((state) => state.profile.user);
  const profilePic = loggedInUser?.profilePic?.url;

  const [loading, setLoading] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    // `emojiData` contains the selected emoji
    setPostCaption((prevInput) => prevInput + emojiData.emoji);
  };

  // FUNCTION TO TOGGLE IMAGE AREA
  const handleImageButtonClick = () => {
    setShowImageArea(!showImageArea);
  };
  const dispatch = useDispatch();

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      // console.log("PostCaption: ", postCaption);
      if (!postImage) {
        console.log("No image selected.");
        return;
      }

      console.log("Uploading post...");
      const response = await createPost({
        postCaption: postCaption,
        file: postImage,
      });

      console.log("Response of new Post: ", response);

      // Add POST to all Posts array
      dispatch(addNewPost(response.newPost));
      // Add POST to current user state
      dispatch(setNewPostToUser(response.newPost));

      console.log("Post uploaded successfully");

      console.log(response.message);
      setShowImageArea(false);
      setPostImage(null);
      setPostCaption("");
    } catch (error) {
      console.log("Error while creating Post: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1A1A] h-fit px-4 xs:px-6 py-4 rounded-lg">
      {/* Upper Section */}
      <div className="relative">
        {" "}
        <div className="flex gap-x-4 items-center">
          {/* Profile Image */}
          <Link to={`/user/${loggedInUser?._id}`}>
            <img
              src={profilePic}
              alt="profile"
              className="rounded-full w-9  md:w-12  object-cover aspect-square"
            />
          </Link>

          {/* Input Text */}
          <input
            type="text"
            value={postCaption}
            onChange={(e) => setPostCaption(e.target.value)}
            placeholder="What's on your mind..."
            className="flex-grow bg-[#333333] text-white focus:outline-none px-4 xs:px-8 text-sm py-2 md:py-4 md:px-3 rounded-full"
          />
          {/* Emoji Button */}
          <div
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className=" hidden xs:block border border-[#00D5FA] rounded-sm py-2 px-3 text-white cursor-pointer"
          >
            <BsEmojiSunglasses color="#00D5FA" />
          </div>
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute top-20 z-10">
              <EmojiPicker
                width={370}
                height={370}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Line OR Selected Image */}
      <div className="border rounded-md flex items-center justify-center border-[#343434] my-5">
        {/* Conditional Image Upload Area */}
        {showImageArea && (
          <div className="m-4 w-full rounded-md border-2 border-dashed border-[#00D5FA] text-center  text-gray-400">
            <ImageUploader setPostImage={setPostImage} />
          </div>
        )}
      </div>

      {/* Lower Section */}
      <div className="flex items-center gap-x-4 justify-between">
        {/* Icon-Btns */}
        <div className="flex gap-x-4 text-gray-400">
          <button
            className="flex items-center"
            onClick={handleImageButtonClick}
          >
            <CiImageOn />
            <span className="ml-1">Image</span>
          </button>
        </div>
        {/* Three-Dots */}
        <div>
          <button disabled className="items-center flex">
            <BsThreeDots />
          </button>
        </div>
        {/* Post Button */}
        <button
          onClick={handleCreatePost}
          disabled={loading || !postCaption || !postImage}
          className={`${
            !postCaption || !postImage ? "cursor-not-allowed" : ""
          } bg-[#00D5FA] text-black font-semibold rounded-full px-4 py-1`}
        >
          {loading ? "Posting..." : "POST"}
        </button>
      </div>
    </div>
  );
}
