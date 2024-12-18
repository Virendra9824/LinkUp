
import React, { useEffect, useState ,useRef} from "react";
import { io } from "socket.io-client";
import { sendMessage, getAllMessages } from "../../apis/chatApi"; // Removed uploadImage import
import { FaImage } from "react-icons/fa6"; // You can keep this import if you want to keep the icon
import ChatComponent from "./ChatComponent";



export default function UserChat({ activeChat, currentUser, setActiveChat,allChats,onlineUser,socket,messages,setMessages,currentChatMessages,setCurrentChatMessages
}) {
 
  const [newMessage, setNewMessage] = useState("");
  

  console.log("onlineuser",onlineUser)

  const fetchMessages = async () => {
    try {
      const data = await getAllMessages(activeChat._id);
      console.log("fetch data message",data)
      setMessages(data.messages ? data.messages : []);
    } catch (err) {
      console.error("Error fetching messages:", err.message);
    }
  };

  useEffect(() => {
    if (activeChat?.chatId) {
      fetchMessages();
    }

  }, [activeChat]);
  



  useEffect(() => {
    if (activeChat?.chatId) {
      const filteredMessages = messages.filter(
        (msg) => msg?.chatId === activeChat?.chatId
      );
      setCurrentChatMessages(filteredMessages || []);
    }
  }, [messages, activeChat,socket]);

 

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const message = await sendMessage(activeChat._id, newMessage);
      console.log("send messags is ",message)
 
    
      setMessages((prev) => [...prev, message]);
      setCurrentChatMessages((prev) => [...prev, message]); 
      console.log("setcurrent message:",currentChatMessages);
    
      socket.emit("sendMessage", {
        senderId: currentUser._id,
        chatId: activeChat.chatId,
        content: newMessage,
        receiverId: activeChat._id,
      });
      
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err.message);
    }
  };

  //
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChatMessages]);
  
  return (
    <div className="flex flex-col h-full p-6">
      {/* Chat header */}
      <div className="p-2 flex items-center bg-[#333333] justify-center rounded-xl border border-white sticky rounded-lg">
        <img
          src={activeChat?.profilePic?.url || "https://via.placeholder.com/150"}
          alt={`${activeChat?.firstName} ${activeChat?.lastName}`}
          className="w-14 h-14 rounded-full mr-3"
        />
        <p className="font-bold text-2xl">
          {activeChat?.firstName} {activeChat?.lastName}
        </p>
      </div>
      
      
 

      {/* Chat messages */}
      <div  ref={chatContainerRef} className="flex-1 bg-[#1A1A1A] p-4 overflow-y-auto max-h-[400px]">
        {currentChatMessages.length > 0 ? (
          [...currentChatMessages].reverse().map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg?.sender?.toString() === currentUser ?._id?.toString()
                ? "justify-end"
                : "justify-start"
                }`}
            >
              <div
                className={`p-2 mb-2 rounded-lg max-w-xs ${msg?.sender?.toString() === currentUser ?._id?.toString()
                  ? "bg-blue-500 text-white"
                  : "bg-gray-600 text-black"
                  }`}
              >
                {msg?.content || "Message content unavailable"}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">No messages</div>
        )}
      </div>
      {/* <ChatComponent currentChatMessages ={currentChatMessages} currentUser={currentUser} /> */}

      {/* Message input */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 rounded bg-[#1A1A1A] border border-[#333333] text-white placeholder-gray-400 hover:border-white"
        />
        <button
          onClick={ handleSendMessage}
          className="p-2 bg-cyan-500 rounded text-white hover:bg-[#1A1A1A] text-cyan-500 font-bold"
        >
          SEND
        </button>
      </div>
    </div>
  );
}