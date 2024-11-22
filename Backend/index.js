const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinaryConfig.js");

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

// Set up the server using http.createServer
const server = http.createServer(app);

// Set up Socket.IO on the server
const io = new Server(server, {
	cors: {
	  origin: FRONTEND_URL,
	  methods: ["GET", "POST"],
	  credentials: true,
	},
  });
  
  // Handle WebSocket connections
  io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);
  
	// Listen for messages and forward them to the receiver
	socket.on("send_message", (data) => {
	  console.log("Message received:", data);
	  io.to(data.receiverId).emit("receive_message", data); // Send message to receiver
	});
  
	// Join a room for chat
	socket.on("join_room", (roomId) => {
	  socket.join(roomId);
	  console.log(`User with ID ${socket.id} joined room: ${roomId}`);
	});
  
	// Handle disconnect
	socket.on("disconnect", () => {
	  console.log("User disconnected:", socket.id);
	});
  });
  

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
app.use("/api/chat", messageRoutes);

app.listen(PORT, () => {
	console.log("Jai Shree RAM🚩");
	console.log("App is listening on port: ", PORT);
});
