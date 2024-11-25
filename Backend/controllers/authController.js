const User = require("../models/userSchema");
const OTP = require("../models/OTPSchema");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getDataUrl = require("../utils/uriGenerator");
const path = require("path");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const generateToken = require("../utils/generateToken");

const cloudinary = require("cloudinary").v2; // Ensure Cloudinary is required

//sendOTP
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
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !gender ||
      !password ||
      !confirmPassword ||
      !otp
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
        message: "User already registered",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and ConfirmPassword Value do not match, please try again",
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
        const uploadResponse = await uploadImageToCloudinary(
          profilePic,
          "profile_images"
        );
        profileImageUrl = uploadResponse.secure_url; // Cloudinary URL
        profileImageId = uploadResponse.public_id; // Cloudinary public_id
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
      password: hashedPassword,
      profilePic: {
        url: profileImageUrl,
        id: profileImageId,
      },
    });
    console.log("user creates successfully :");

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
    const user = await User.findOne({ email });
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
    user.password = null; // Remove sensitive data before sending the response

    // Send success response with token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Send the JWT token
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image, // Include user image URL if needed
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured in Login :",
    });
  }
};

// Request New OTP for Password Reset
exports.requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate if email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate a new OTP
    const otp = (Date.now() % 1000000).toString().padStart(6, "0"); // Generate OTP using timestamp (you can use other methods if needed)
    console.log("OTP generated:", otp);

    // Create OTP record
    const otpPayload = { email, otp };
    await OTP.create(otpPayload); // Save OTP in the database

    // Send OTP to the user (You can integrate email service to actually send the OTP)
    console.log(`Sending OTP: ${otp} to ${email}`);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password must match",
      });
    }

    // Fetch the most recent OTP for the user
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }); // Fetch only the most recent OTP
    console.log("Recent OTP fetched:", recentOtp); // Log the entire OTP object
    console.log("request.body otp", otp);
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP Not Found",
      });
    }

    // Check if OTP matches the one stored in the database
    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Optionally, check if the OTP is expired
    const otpExpirationTime = 10 * 60 * 1000; // 10 minutes
    const otpAge = Date.now() - new Date(recentOtp.createdAt).getTime();

    if (otpAge > otpExpirationTime) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the User collection
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured in resetPassword",
      error: error,
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
		const userPosts = await post.find({ owner: userId });

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
