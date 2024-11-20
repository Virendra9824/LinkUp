const User = require("../models/userSchema.js");
const Post = require("../models/postSchema.js");
const getDataUrl = require("../utils/uriGenerator.js");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");

// create Post
exports.createPost = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		const { caption } = req.body;

		const file = req.file;

		if (!file) {
			return res.status(400).json({
				message: "File is missing",
			});
		}

		const mimeType = file.mimetype;
		const type = mimeType.split("/")[0];

		const fileUrl = getDataUrl(file);

		let option;

		if (type == "video") {
			option = {
				resource_type: "video",
			};
		} else {
			option = {};
		}

		const myCloud = await cloudinary.v2.uploader.upload(
			fileUrl.content,
			option
		);

		const newPost = await Post.create({
			owner: userId,
			caption,
			type,
			media: {
				id: myCloud.public_id,
				url: myCloud.secure_url,
			},
		});

		await user.posts.push(newPost._id);

		await user.save();

		return res.status(200).json({
			message: "Post created successfully",
			success: true,
			newPost,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while creating newPost: " + error.message,
			success: false,
		});
	}
};

// get all Posts
exports.getAllPosts = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		const allPosts = await Post.find()
			.sort({ createdAt: -1 })
			.populate("owner", "-password")
			.populate("comments.user", "-password");

		const images = await Post.find({ type: "image" })
			.sort({ createdAt: -1 })
			.populate("owner", "-password")
			.populate("comments.user", "-password");

		const reels = await Post.find({ type: "video" })
			.sort({ createdAt: -1 })
			.populate("owner", "-password")
			.populate("comments.user", "-password");

		return res.status(200).json({
			message: "All Posts fetched successfully",
			success: true,
			data: { allPosts, images, reels },
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while Fetching all posts: " + error.message,
			success: false,
		});
	}
};

// Delete Post
exports.deletePost = async (req, res) => {
	try {
		const userId = req.user.id;
		let { postId } = req.body;
		postId = new mongoose.Types.ObjectId(postId);

		const user = await User.findById(userId);
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({
				message: "Post not found with given id",
			});
		}

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		if (!post.owner.equals(userId)) {
			return res.status(403).json({
				message: "You are not authorized to delete this post",
			});
		}

		if (post.media && post.media.id) {
			await cloudinary.v2.uploader.destroy(post.media.id);
		}

		await User.findByIdAndUpdate(userId, {
			$pull: { posts: postId },
		});

		await Post.findByIdAndDelete(postId);

		return res.status(200).json({
			message: "Post deleted successfully",
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while deleting Post: " + error.message,
			success: false,
		});
	}
};

// update Post CAPTION
exports.updatePost = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		const { caption } = req.body;
		const postId = req.params.id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({
				message: "Post not found with given id",
			});
		}

		if (post.owner.toString() !== userId.toString()) {
			return res.status(403).json({
				message: "You are not authorized to update this post",
			});
		}

		post.caption = caption || post.caption;

		await post.save();

		return res.status(200).json({
			message: "Post updated successfully",
			success: true,
			updatedPost: post,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while updating Post: " + error.message,
			success: false,
		});
	}
};

// Like/Unlike Post
exports.likeUnlikePost = async (req, res) => {
	try {
		// console.log("Backend: ", req.body);
		const userId = req.user.id;
		let { postId } = req.body;
		postId = new mongoose.Types.ObjectId(postId);
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({
				message: "Post not found with given id",
			});
		}

		if (post.likes.includes(userId)) {
			post.likes.pull(userId);
			await post.save();

			return res.status(200).json({
				message: "Post Unliked successfully",
				success: true,
				updatedPost: post,
			});
		} else {
			post.likes.push(userId);
			await post.save();

			return res.status(200).json({
				message: "Post Liked successfully",
				success: true,
				updatedPost: post,
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while Like/Unlike Post: " + error.message,
			success: false,
		});
	}
};

// comment On Post
exports.commentOnPost = async (req, res) => {
	try {
		const userId = req.user.id;
		// const postId = req.params.id;
		let { postId } = req.body;
		postId = new mongoose.Types.ObjectId(postId);
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({
				message: "Post not found with given id",
			});
		}

		const { comment } = req.body;

		if (!comment) {
			return res.status(400).json({
				message: "Comment field is required",
			});
		}

		post.comments.push({
			user: userId,
			comment,
		});

		await post.save();

		return res.status(200).json({
			message: "Comment created successfully",
			success: true,
			updatedPost: post,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while commenting on Post: " + error.message,
			success: false,
		});
	}
};

// Delete comment from Post
exports.deleteComment = async (req, res) => {
	try {
		// console.log("Backend: ", req.body);
		const userId = req.user.id;
		// const postId = req.params.id;
		let { postId } = req.body;
		postId = new mongoose.Types.ObjectId(postId);
		const { commentId } = req.body;

		if (!commentId) {
			return res.status(400).json({
				message: "CommentId is missing",
			});
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({
				message: "Post not found with given id",
			});
		}

		const commentIndex = post.comments.findIndex(
			(comment) => comment._id.toString() === commentId.toString()
		);

		const comment = post.comments[commentIndex];

		if (
			post.owner.toString() == userId.toString() ||
			comment.user.toString() == userId.toString()
		) {
			post.comments.pull(commentId);
			await post.save();

			return res.status(200).json({
				message: "Comment deleted successfully",
				success: true,
				updatedPost: post,
			});
		} else
			return res.status(403).json({
				message: "You are not authorized to delete this comment",
			});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while deleting comment: " + error.message,
			success: false,
		});
	}
};
