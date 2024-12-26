const express = require("express");
const {
	createPost,
	deletePost,
	getAllPosts,
	updatePost,
	likeUnlikePost,
	commentOnPost,
	deleteComment,
} = require("../controllers/postController");
const { isAuth } = require("../middlewares/isAuth");
const uploadFile = require("../middlewares/multer");

const router = express.Router();

router.post("/new", isAuth, uploadFile, createPost);
router.post("/:id", isAuth, deletePost);
router.get("/all", isAuth, getAllPosts);
router.put("/update/", isAuth, updatePost);
router.post("/like/:id", isAuth, likeUnlikePost);
router.post("/comment/:id", isAuth, commentOnPost);
router.post("/comment/delete/:id", isAuth, deleteComment);

module.exports = router;
