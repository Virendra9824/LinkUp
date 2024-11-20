const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes.js");
// const messageRoutes = require("./routes/messageRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinaryConfig.js");

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

const corsOptions = {
	origin: FRONTEND_URL,
	credentials: true,
};

// Use the CORS middleware
app.use(cors(corsOptions));

connectDB();

cloudinaryConnect();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("<h1>Congratulations, your server is running!</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/chat", messageRoutes);

app.listen(PORT, () => {
	console.log("Jai Shree RAM🚩");
	console.log("App is listening on port: ", PORT);
});
