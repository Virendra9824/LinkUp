const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found!" });
    }

    // Verify token and handle potential errors
    let decodedData;
    try {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Check if error is due to an expired token
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired. Please log in again.",
        });
      }
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid!" });
    }

    // Retrieve user and check if user exists
    req.user = await User.findById(decodedData.id);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Please Login: " + error.message,
      error: error,
    });
  }
};
