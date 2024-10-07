import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";
import { Send } from "lucide-react";

const socket = io(`${import.meta.env.VITE_Backend_api}`);

const Chat = ({ conversationId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    setIsLoading(false);
    socket.emit("joinRoom", { conversationId });

    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
      setIsLoading(false);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, [conversationId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("sendMessage", {
        conversationId,
        senderId: userId,
        message: newMessage,
      });
      setNewMessage("");
    }
  };

  //   if (isLoading) {
  //     return <div className="flex justify-center items-center h-full">Loading...</div>;
  //   }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender._id === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender._id === userId
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {msg.sender._id !== userId && (
                <div className="font-bold text-sm mb-1">{msg.sender.name}</div>
              )}
              <div>{msg.message}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  conversationId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default Chat;
