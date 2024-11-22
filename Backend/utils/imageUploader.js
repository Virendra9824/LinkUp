const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder) => {
    const options = {
        folder,
        resource_type: "auto"
    };

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result); // If successful, resolve with the result
        });

        // Upload the actual buffer from the file
        uploadStream.end(file.buffer);  // file.buffer contains the image data directly
    });
};
