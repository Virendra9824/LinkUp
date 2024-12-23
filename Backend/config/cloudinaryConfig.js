const cloudinary = require("cloudinary").v2;

exports.cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
		console.log("Successfully connected to Cloudinary!");
	} catch (err) {
		console.log("Error while connecting to Cloudinary: ", err);
	}
};
