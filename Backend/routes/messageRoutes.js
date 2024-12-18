const express = require("express");
const { isAuth } = require("../middlewares/isAuth");
const uploadFile = require("../middlewares/multer");
const {
	sendMessage,
	getAllMessages,
	getAllChats,
} = require("../controllers/messageController");

const router = express.Router();

// router.post("/new", isAuth, uploadFile, createPost);
router.post("/", isAuth, sendMessage);
router.get("/chats", isAuth, getAllChats);
router.get("/:id", isAuth, getAllMessages);

module.exports = router;
