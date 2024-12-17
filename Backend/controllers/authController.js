const User = require("../models/userSchema");
const Post = require("../models/postSchema");
const OTP = require("../models/OTPSchema");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getDataUrl = require("../utils/uriGenerator");
const path = require("path");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const generateToken = require("../utils/generateToken");
const { error } = require("console");

const cloudinary = require("cloudinary").v2; // Ensure Cloudinary is required

exports.sendOTP = async (req, res) => {
	try {
		const { email } = req.body;

		const checkUserPresent = await User.findOne({ email });

		if (checkUserPresent) {
			return res.status(401).json({
				success: false,
				message: "User already registered",
			});
		}

		function generateOtp() {
			return (Date.now() % 1000000).toString().padStart(6, "0");
		}

		const otp = generateOtp();
		console.log("OTP generated: ", otp);

		const otpPayload = { email, otp };

		//create an entry for OTP
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP generate info: ", otpBody);

		// console.log(otpBody);

		//return response successful
		res.status(200).json({
			success: true,
			message: "OTP Sent Successfully",
			otp,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.signUp = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			gender,
			password,
			confirmPassword,
			otp,
			role,
		} = req.body;

		if (
			!firstName ||
			!lastName ||
			!email ||
			!gender ||
			!password ||
			!confirmPassword ||
			!otp ||
			!role
		) {
			return res.status(403).json({
				success: false,
				message: "All fields are required",
			});
		}

		const checkUserPresent = await User.findOne({ email });

		if (checkUserPresent) {
			return res.status(401).json({
				success: false,
				message: "User already exists.",
			});
		}

		// Check if passwords match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and ConfirmPassword mismatch.",
			});
		}

		const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }); // Fetch only the most recent OTP

		console.log("Recent OTP fetched:", recentOtp); // Log the entire OTP object

		if (!recentOtp) {
			return res.status(400).json({
				success: false,
				message: "OTP Not Found",
			});
		}

		// console.log("Received OTP:", otp);
		// console.log("Stored OTP:", recentOtp.otp); // Log the OTP value

		if (Number(otp) !== Number(recentOtp.otp)) {
			console.log("Received OTP:", otp);
			console.log("Stored OTP:", recentOtp.otp);
			return res.status(400).json({
				success: false,
				message: "Invalid OTP",
			});
		}

		// OTP is valid - Proceed to register the user

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Profile Pic Handling
		const profilePic = req.file;
		console.log("Profile Pic:", profilePic);

		let profileImageUrl, profileImageId;

		if (profilePic) {
			try {
				const fileUrl = getDataUrl(profilePic);
				const myCloud = await cloudinary.uploader.upload(
					fileUrl.content
				);
				profileImageUrl = myCloud.secure_url; // Cloudinary URL
				profileImageId = myCloud.public_id; // Cloudinary public_id
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: "Profile picture upload failed",
					error: error.message,
				});
			}
		} else {
			profileImageUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
			profileImageId = null; // No image uploaded, use a default
		}

		// Create user entry in the database
		const newUser = await User.create({
			firstName,
			lastName,
			email,
			gender,
			role,
			password: hashedPassword,
			profilePic: {
				url: profileImageUrl,
				id: profileImageId,
			},
		});
		newUser.password = null;
		console.log("user created successfully :");

		// Return success response
		return res.status(200).json({
			success: true,
			message: "User is registered successfully",
			user: newUser,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again",
			error: error,
		});
	}
};

// Login function
exports.login = async (req, res) => {
	try {
		// Fetch email and password from request body
		const { email, password } = req.body;

		// Validate that both email and password are provided
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and Password are required",
			});
		}

		// Check if user exists in the database
		const user = await User.findOne({ email }).populate(
			"posts followings followers"
		);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Compare the provided password with the stored hashed password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				message: "Invalid password",
			});
		}

		// Create a JWT token for the user
		const token = generateToken(user._id, res); // Capture the token

		// Convert to plain object and delete password field
		const userObj = user.toObject();
		delete userObj.password;

		// Send success response with token
		res.status(200).json({
			success: true,
			message: "Login successful",
			token, // Send the JWT token
			user: userObj,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while login ",
			error,
		});
	}
};

// Generate and Send OTP
exports.requestPasswordResetOtp = async (req, res) => {
	try {
		const { email } = req.body;

		// Step 2: Validate if email exists
		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		// Step 3: Generate OTP
		function generateOtp() {
			return (Date.now() % 1000000).toString().padStart(6, "0");
		}

		const otp = generateOtp();
		// console.log("OTP generated: ", otp);

		// Step 4: Save OTP in the database
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		// console.log("OTP generated info: ", otpBody);

		// Step 5: Respond with success message
		return res.status(200).json({
			success: true,
			message: "OTP sent successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// Reset Password
exports.resetPassword = async (req, res) => {
	try {
		const { email, otp, password, confirmPassword } = req.body;

		// Validate fields
		if (!email || !otp || !password || !confirmPassword) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		if (password !== confirmPassword) {
			return res
				.status(400)
				.json({ success: false, message: "Passwords do not match" });
		}

		// Find most recent OTP
		const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

		if (Number(otp) !== Number(recentOtp.otp)) {
			// console.log("Received OTP:", otp);
			// console.log("Stored OTP:", recentOtp.otp);
			return res.status(400).json({
				success: false,
				message: "Invalid OTP",
			});
		}

		// Check OTP expiry
		const otpAge = Date.now() - new Date(recentOtp.createdAt).getTime();
		if (otpAge > 10 * 60 * 1000) {
			return res
				.status(400)
				.json({ success: false, message: "OTP has expired" });
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Update password
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." });
		}

		user.password = hashedPassword;
		await user.save();

		return res
			.status(200)
			.json({ success: true, message: "Password reset successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: `Error while reset password: ${error.message}`,
			error: error,
		});
	}
};

exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword } = req.body;
		console.log("old password : ", oldPassword);
		console.log("new password : ", newPassword);

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		console.log(userDetails.password); // Hashed password in the database
		console.log("old password ", oldPassword); // Plain-text password entered by user

		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res.status(401).json({
				success: false,
				message: "The password is incorrect",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Return success response
		return res.status(200).json({
			success: true,
			message: "Password updated successfully",
		});
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};

exports.logoutUser = async (req, res) => {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			sameSite: "strict",
			secure: true,
		});

		return res.status(200).json({
			success: true,
			message: "User logged out successfully!",
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error in logout: " + error.message,
			success: false,
		});
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		const userId = req.user.id;

		// Don't delete Deepak user
		if (userId == "6728b8247c5ec5f7bebe5458") {
			return res.status(401).json({
				message: "Deepak user cannot be deleted.",
				success: false,
			});
		}

		// Step 1: Delete all posts by the user, including media on Cloudinary
		const userPosts = await Post.find({ owner: userId });

		for (const post of userPosts) {
			// Delete media from Cloudinary if it exists
			if (post.media && post.media.id) {
				await cloudinary.uploader.destroy(post.media.id);
			}
			// Delete the post itself from the database
			await Post.deleteOne({ _id: post._id });
		}

		// Step 2: Remove likes and comments made by the user on others' posts
		await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });
		await Post.updateMany(
			{ "comments.user": userId },
			{ $pull: { comments: { user: userId } } }
		);

		// Step 3: Delete all messages authored by the user
		// await Message.deleteMany({ sender: userId });

		// Step 4: Update all chats to remove the user from participants and delete their messages
		// const chats = await Chat.find({ participants: userId });

		// for (const chat of chats) {
		// 	// Remove user from participants array and delete their messages in each chat
		// 	await Chat.updateOne(
		// 		{ _id: chat._id },
		// 		{
		// 			$pull: {
		// 				participants: userId,
		// 				messages: { sender: userId },
		// 			},
		// 		}
		// 	);

		// 	// Delete chat if it has no participants left
		// 	const updatedChat = await Chat.findById(chat._id);
		// 	if (updatedChat.participants.length === 0) {
		// 		await Chat.deleteOne({ _id: chat._id });
		// 	}
		// }

		// Step 5: Remove the user from all followers' and followings' lists
		await User.updateMany(
			{ followers: userId },
			{ $pull: { followers: userId } }
		);
		await User.updateMany(
			{ followings: userId },
			{ $pull: { followings: userId } }
		);

		// Step 6: Optionally delete profile picture from external storage if needed
		const user = await User.findById(userId);
		if (user.profilePic && user.profilePic.id) {
			await cloudinary.uploader.destroy(user.profilePic.id);
		}

		// Step 7: Finally, delete the user document itself
		await User.findByIdAndDelete(userId);

		res.status(200).json({
			success: true,
			message: "A/C deleted successfully!",
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while Deleting A/C: " + error.message,
			success: false,
		});
	}
};
