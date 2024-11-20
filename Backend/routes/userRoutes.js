const express = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const {
  myProfile,
  userProfile,
  followAndUnfollowUser,
  followersData,
  followingsData,
  updateProfile,
  updatePassword,
  getAllUsers,
} = require("../controllers/userController.js");
const uploadFile = require("../middlewares/multer.js");

const router = express.Router();

router.get("/me", isAuth, myProfile);
router.get("/all", isAuth, getAllUsers);
router.get("/:id", isAuth, userProfile);
router.post("/follow/:id", isAuth, followAndUnfollowUser);
router.get("/followers/:id", isAuth, followersData);
router.get("/followings/:id", isAuth, followingsData);
router.put("/updateprofile", isAuth, uploadFile, updateProfile);
router.put("/updatepassword", isAuth, updatePassword);

module.exports = router;
