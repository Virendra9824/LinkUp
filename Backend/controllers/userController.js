const User = require("../models/userSchema.js");
const getDataUrl = require("../utils/uriGenerator.js");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

exports.myProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while fetching user data: " + error.message,
			success: false,
		});
	}
};

// Find user with give ID
exports.userProfile = async (req, res) => {
	try {
		const userId = req.params.userId;
		const user = await User.findById(userId)
			.select("-password") // Exclude the password field from the User document
			.populate({
				path: "posts", // Populate the 'posts' field in the User document
				populate: [
					{
						path: "owner", // Populate the 'owner' field inside each post
						select: "-password", // Exclude the password field from the owner
					},
					{
						path: "comments", // Populate the 'comments' field inside each post
						populate: {
							path: "user", // Optionally populate the 'user' field inside each comment
							select: "-password", // Fetch only specific fields from the user (like name and email)
						},
					},
				],
			});

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		const followings = await User.findById(req.user.id)
			.select("followings")
			.populate({
				path: "followings",
				select: "firstName lastName email gender profilePic",
			})
			.exec();

		return res.status(200).json({ user });
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while fetching user data: " + error.message,
			success: false,
		});
	}
};

// Follow and UnFollow user
exports.followAndUnfollowUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).select("-password");

		const loggedInUser = await User.findById(req.user.id).select(
			"-password"
		);

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		if (user._id.toString() === loggedInUser._id.toString())
			return res.status(400).json({
				message: "You cannot follow or unfollow yourself",
			});

		// Unfollow user
		if (user.followers.includes(loggedInUser._id)) {
			user.followers = user.followers.filter(
				(follower) =>
					follower.toString() !== loggedInUser._id.toString()
			);

			loggedInUser.followings = loggedInUser.followings.filter(
				(following) => following.toString() !== user._id.toString()
			);

			await user.save();
			await loggedInUser.save();

			return res.status(200).json({
				message: "User unfollowed successfully",
				success: true,
			});
		}

		// Follow user
		else {
			user.followers.push(loggedInUser._id);
			loggedInUser.followings.push(user._id);
			await user.save();
			await loggedInUser.save();
			return res.status(200).json({
				message: "User followed successfully",
				success: true,
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error in Follow/Unfollow user as: " + error.message,
			success: false,
		});
	}
};

// Get user's Followers
exports.followersData = async (req, res) => {
	try {
		const followers = await User.findById(req.params.id)
			.select("followers")
			.populate("followers", "-password");

		return res.status(200).json({
			message: "Followers fetched successfully",
			success: true,
			data: followers,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error in getting followers data: " + error.message,
			success: false,
		});
	}
};

// Get user's Followings
exports.followingsData = async (req, res) => {
	try {
		let userId = req.user.id;
		console.log("userId is: ", userId);
		const followings = await User.findById(userId)
			.select("followings")
			.populate({
				path: "followings",
				select: "firstName lastName email gender profilePic",
			})
			.exec();

		return res.status(200).json({
			message: "Followings data fetched successfully",
			success: true,
			data: followings,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error in getting followings data: " + error.message,
			success: false,
		});
	}
};

// UpdateProfile
exports.updateProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		const { password } = req.body;

		// Check if password is provided
		if (!password) {
			return res.status(400).json({
				message: "Password is required.",
			});
		}

		// Compare provided password with stored hashed password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({
				message: "Invalid credentials.",
			});
		}

		const { userName, firstName, lastName, gender, role, bio } = req.body;
		// Validate and update the username
		if (userName) {
			const existingUser = await User.findOne({
				userName,
				_id: { $ne: req.user.id },
			});
			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: "Username is already taken.",
				});
			}
			user.userName = userName;
		}

		if (firstName) {
			user.firstName = firstName;
		}

		if (lastName) {
			user.lastName = lastName;
		}

		if (gender) {
			user.gender = gender;
		}

		if (role) {
			user.role = role;
		}
		if (bio) {
			user.bio = bio;
		}

		// Update profilePic
		const file = req.file;
		if (file) {
			const fileUrl = getDataUrl(file);
			// Delete previous file (if it exists)
			if (user.profilePic?.id)
				await cloudinary.v2.uploader.destroy(user.profilePic.id);

			const myCloud = await cloudinary.v2.uploader.upload(
				fileUrl.content
			);

			user.profilePic.id = myCloud.public_id;
			user.profilePic.url = myCloud.secure_url;
		}

		await user.save();

		return res.status(200).json({
			message: "Profile Updated successfully",
			success: true,
			updatedUser: user,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error in updating profile: " + error.message,
			success: false,
		});
	}
};

// UpdatePassword
exports.updatePassword = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json({
				message: "User not found with given id",
			});
		}

		const { oldPassword, newPassword } = req.body;

		if (!oldPassword || !newPassword) {
			return res.status(400).json({
				message: "Please provide all required fields!",
			});
		}

		const storedPassword = user.password;
		const isPasswordValid = await bcrypt.compare(
			oldPassword,
			storedPassword
		);

		if (!isPasswordValid) {
			return res.status(401).json({
				message: "Incorrect old password!",
				success: false,
			});
		}

		user.password = await bcrypt.hash(newPassword, 10);

		await user.save();

		return res.status(200).json({
			message: "Password Updated successfully",
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error in updating password: " + error.message,
			success: false,
		});
	}
};

// Get all users
exports.getAllUsers = async (req, res) => {
	try {
		const search = req.query.search || "";
		const users = await User.find({
			name: { $regex: search, $options: "i" },
			_id: { $ne: req.user.id },
		}).select("-password");

		if (!users) {
			return res.status(404).json({
				message: "Users not found",
			});
		}

		return res.status(200).json({
			message: "Users fetched successfully",
			success: true,
			data: users,
		});
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Error while fetching all users: " + error.message,
			success: false,
		});
	}
};
