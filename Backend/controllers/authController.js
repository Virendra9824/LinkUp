const User = require("../models/userSchema.js");
const Post = require("../models/postSchema.js");
// const Message = require("../models/messageSchema.js");
const Chat = require("../models/chatSchema.js");
const generateToken = require("../utils/generateToken.js");
const getDataUrl = require("../utils/uriGenerator.js");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");

exports.registerUser = async (req, res) => {
	try {
		const { name, email, password, gender } = req.body;
		const file = req.file;

		if (!name || !email || !password || !gender) {
			res.status(403).json({
				success: false,
				message: "Please provide all required fields!",
			});
		}

		let user = await User.findOne({ email: email });

		if (user) {
			return res.status(409).json({
				success: false,
				message: "User already exists!",
			});
		}

		let fileUrl = null;
		let myCloud = null;

		if (file) {
			fileUrl = getDataUrl(file);
			myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);
		}

		const hashPassword = await bcrypt.hash(password, 10);

		user = await User.create({
			name,
			email: email,
			password: hashPassword,
			gender,
			profilePic: file
				? { id: myCloud.public_id, url: myCloud.secure_url }
				: null,
		});

		generateToken(user._id, res);

		res.status(201).json({
			success: true,
			message: "User registered successfully!",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				gender: user.gender,
				profilePic: user.profilePic,
			},
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error in registration process as: " + error.message,
			success: false,
		});
	}
};

exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(403).json({
				success: false,
				message: "Please provide all required fields!",
			});
		}

		let user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User doesn't exists!",
			});
		}

		let originalPassword = user.password;
		let isPasswordValid = await bcrypt.compare(password, originalPassword);

		if (!isPasswordValid) {
			return res.status(403).json({
				success: false,
				message: "Incorrect password!",
			});
		}

		generateToken(user._id, res);
		user.password = null;

		res.status(201).json({
			success: true,
			message: "User logged in successfully!",
			user,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error in log in: " + error.message,
			success: false,
		});
	}
};

exports.logoutUser = async (req, res) => {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			sameSite: "strict",
			// secure: true,
		});

		res.status(200).json({
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
		await Message.deleteMany({ sender: userId });

		// Step 4: Update all chats to remove the user from participants and delete their messages
		const chats = await Chat.find({ participants: userId });

		for (const chat of chats) {
			// Remove user from participants array and delete their messages in each chat
			await Chat.updateOne(
				{ _id: chat._id },
				{
					$pull: {
						participants: userId,
						messages: { sender: userId },
					},
				}
			);

			// Delete chat if it has no participants left
			const updatedChat = await Chat.findById(chat._id);
			if (updatedChat.participants.length === 0) {
				await Chat.deleteOne({ _id: chat._id });
			}
		}

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
