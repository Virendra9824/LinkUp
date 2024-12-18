import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const ImageUploader = ({ setPostImage, thumbnailLink }) => {
  const [postImage, setLocalPostImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // If thumbnailLink is passed as a prop and is valid, set it as the initial preview
    if (thumbnailLink && !postImage) {
      setPreviewUrl(thumbnailLink);
    }
  }, [thumbnailLink]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalPostImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPostImage(file); // Update the postImage state in CreatePost
    }
  };

  const handleCancelImage = () => {
    setLocalPostImage(null);
    setPreviewUrl(null);
    setPostImage(null); // Reset the postImage state in CreatePost
  };

  return (
    <div className="relative w-full h-full">
      <div className="block w-full">
        {/* If previewUrl is set, display the preview image */}
        {!previewUrl ? (
          <label
            className="text-gray-400 block w-full py-4 cursor-pointer"
            htmlFor="image-upload"
          >
            Click to upload an image
          </label>
        ) : (
          <div className="relative w-full">
            <img
              src={previewUrl} // Show the thumbnailLink or selected file preview
              alt="Preview"
              className="aspect-video w-full object-fill rounded-md"
            />
            <button
              className="p-1 absolute top-1 right-1 bg-red-500 text-white rounded-full text-center flex items-center justify-center hover:bg-red-600"
              onClick={handleCancelImage}
            >
              <RxCross2 color="white" />
            </button>
          </div>
        )}
      </div>

      {/* File input */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUploader;
