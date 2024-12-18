const express = require("express");
const router = express.Router();
const {
	login,
	requestPasswordResetOtp,
	resetPassword,
	sendOTP,
	signUp,
	logoutUser,
	deleteAccount,
	changePassword,
} = require("../controllers/authController.js");
const uploadFile = require("../middlewares/multer");
const { isAuth } = require("../middlewares/isAuth");

// Public Routes
router.post("/send-otp", sendOTP);
router.post("/signup", uploadFile, signUp);
router.post("/login", login);

router.get("/logout", isAuth, logoutUser);
router.delete("/delete-account", isAuth, deleteAccount);

router.post("/reset-password-otp", requestPasswordResetOtp);
router.post("/reset-password", resetPassword);
router.post("/change-password", isAuth, changePassword);

module.exports = router;
