const User = require("../models/userSchema.js");
const Chat = require("../models/chatSchema.js");
const Message = require("../models/messageSchema.js");
const Post = require("../models/postSchema.js");
const getDataUrl = require("../utils/uriGenerator.js");
const cloudinary = require("cloudinary");
const { getReceiverSocketId } = require("../socket/socketHandler.js");
// import { getReceiverSocketId } from "../socket/socketHandler.js";
// const { io } = require("../socket/socket.js");

// Send message
exports.sendMessage = async (req, res) => {
	try {
		const senderId = req.user.id;
		const { receiverId, message } = req.body;

		if (!receiverId || !message ) {
			return res.status(400).json({
				message: "All fields are required!",
			});
		}

		// Check if chat already exists between sender and receiver
		let chat = await Chat.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!chat) {
			// Create a new chat if it doesn't exist
			chat = new Chat({
				participants: [senderId, receiverId],
				latestMessage: { content: message, sender: senderId },
			});

			await chat.save();
		}

		// Create a new message with chatId
		const newMessage = new Message({
			chatId: chat._id,
			content: message,
			sender: senderId,
		});
		// console.log("newmessage:",newMessage)

		await newMessage.save();

		await chat.updateOne({
			latestMessage: 
			{ content: message, sender: senderId },
		});
		await chat.save();

		// return res.status(200).json({
		// 	message: "Message created successfully",
		// 	success: true,
		// 	newMessage,
		// });
		res.status(200).json({
			message: "Message created successfully",
			success: true,
			newMessage,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while Sending Message: " + error.message,
			success: false,
		});
	}
};

// get all Messages
exports.getAllMessages = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		const chat = await Chat.findOne({
			participants: { $all: [userId, id] },
		});

		if (!chat) {
			return res.status(404).json({
				message: "No chat with this user found!",
			});
		}

		const messages = await Message.find({ chatId: chat._id }).sort({
			createdAt: -1,
		});

		return res.status(200).json({
			message: "All Message fetched successfully",
			success: true,
			messages,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while Fetching all Messages: " + error.message,
			success: false,
		});
	}
};

// get all Chats
exports.getAllChats = async (req, res) => {
	try {
		const userId = req.user.id;

		const chats = await Chat.find({
			participants: userId,
		})
			.populate("participants", "name profilePic")
			.sort({ updatedAt: -1 });

		if (!chats || chats.length === 0) {
			return res.status(404).json({
				message: "No chats found!",
			});
		}

		chats.forEach((e) => {
			e.participants = e.participants.filter(
				(user) => user._id.toString() !== req.user.id.toString()
			);
		});

		return res.status(200).json({
			message: "All Chats fetched successfully",
			success: true,
			chats,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while fetching all chats: " + error.message,
			success: false,
		});
	}
};
