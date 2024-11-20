const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  deleteAccount,
} = require("../controllers/authController.js");
const uploadFile = require("../middlewares/multer.js");
const { isAuth } = require("../middlewares/isAuth.js");

const router = express.Router();

router.post("/register", uploadFile, registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuth, logoutUser);
router.delete("/deleteaccount", isAuth, deleteAccount);

module.exports = router;
