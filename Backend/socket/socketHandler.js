const userSocketMap = require("./userSocketMap");
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
const socketHandler = (io) => {

 


  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    console.log("userid", userId)

    if (userId != "undefined") {
      userSocketMap[userId] = socket.id;
    }

   

    io.emit("getOnlineUser", Object.keys(userSocketMap));


    socket.on("sendMessage", (message) => {
      const receiverSocketId = getReceiverSocketId(message.receiverId);
      console.log("inside socket send messages", receiverSocketId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
        console.log(`Message sent to socket ID ${receiverSocketId}`);
      } else {
        console.error("Receiver not connected or socket ID undefined");
      }

      // Emit the message back to the sender (so they can see it instantly)
      const senderSocketId = getReceiverSocketId(message.senderId);
      io.to(senderSocketId).emit("newMessage", message);
      console.log(`Message sent to sender with socket ID ${message.senderId}`);
    });

    

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    
      delete userSocketMap[userId]
      io.emit("getOnlineUser", Object.keys(userSocketMap))
    });
  });
};


module.exports = socketHandler;



