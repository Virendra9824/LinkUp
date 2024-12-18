import { useEffect, useRef } from "react";

const ChatComponent = ({ currentChatMessages, currentUser }) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChatMessages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 bg-[#1A1A1A] p-4 overflow-y-auto max-h-[400px]"
    >
      {currentChatMessages.length > 0 ? (
        [...currentChatMessages].reverse().map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg?.sender?.toString() === currentUser?._id?.toString()
              ? "justify-end"
              : "justify-start"
              }`}
          >
            <div
              className={`p-2 mb-2 rounded-lg max-w-xs ${msg?.sender?.toString() === currentUser?._id?.toString()
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
  );
};

export default ChatComponent;
