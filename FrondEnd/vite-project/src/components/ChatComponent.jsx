import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import io from "socket.io-client";
import { Avatar, ListItemAvatar } from "@mui/material";

const socket = io("http://localhost:3200");

const ChatComponent = ({
  opponentId,
  isAdmin,
  opponentName,
  productDetails,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatBoxRef = useRef(null);
  const userInfo = useSelector((state) => state.user?.userInfo);
  const shopInfo = useSelector((state) => state.store.shopInfo);
  const userId = isAdmin
    ? shopInfo?._id
    : userInfo?._id || "66d7d20144b4f47cc5f8e8de";

  const joinRoom = useCallback(() => {
    if (!userId || !opponentId) return;

    setIsLoading(true);
    setError(null);
    socket.emit("joinRoom", { userId, opponentId });
  }, [userId, opponentId]);

  useEffect(() => {
    joinRoom();

    const handleLoadMessages = ({ messages: loadedMessages }) => {
      setMessages(loadedMessages);
      setIsLoading(false);
    };

    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleError = (errorMessage) => {
      setError(errorMessage);
      setIsLoading(false);
    };

    socket.on("loadMessages", handleLoadMessages);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("error", handleError);

    return () => {
      socket.off("loadMessages", handleLoadMessages);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("error", handleError);
    };
  }, [userId, opponentId, joinRoom]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (newMessage.trim()) {
      socket.emit("sendMessage", {
        userId,
        opponentId,
        message: newMessage,
      });
      setNewMessage("");
    }
  }, [userId, opponentId, newMessage]);

  useEffect(() => {
    if (productDetails) {
      const initialMessage = `Hi, I'm interested in this product:
  Name: ${productDetails.name}
  Price: $${productDetails.price}`;

      socket.emit("sendMessage", {
        userId,
        opponentId,
        message: initialMessage,
      });

      if (productDetails?.image) {
        socket.emit("sendMessage", {
          userId,
          opponentId,
          message: productDetails.image,
        });
      }
    }
  }, [productDetails, userId, opponentId]);

  const markMessageAsRead = useCallback(
    (messageId) => {
      socket.emit("markAsRead", { userId, opponentId, messageId });
    },
    [userId, opponentId]
  );

  const isCurrentUser = useCallback(
    (senderId) => senderId === userId,
    [userId]
  );

  const renderMessage = useCallback((message) => {
    const isImageUrl = (url) => {
      return /\.(jpeg|jpg|gif|png)$/i.test(url);
    };

    if (isImageUrl(message)) {
      return (
        <img
          src={message}
          alt="Product"
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      );
    } else {
      return (
        <Typography variant="body1" sx={{ fontSize: "16px" }}>
          {message}
        </Typography>
      );
    }
  }, []);

  const renderChatContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          Loading...
        </div>
      );
    }

    if (error) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography color="error">{error}</Typography>
          <IconButton onClick={joinRoom} color="primary">
            Retry
          </IconButton>
        </Box>
      );
    }

    if (messages.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No messages yet
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Start the conversation by sending a message!
          </Typography>
        </Box>
      );
    }

    return messages.map((msg) => (
      <Box
        key={msg._id}
        sx={{
          display: "flex",
          justifyContent: isCurrentUser(msg.sender) ? "flex-end" : "flex-start",
          mb: 2,
        }}
      >
        <Paper
          sx={{
            p: 1.5,
            background: isCurrentUser(msg.sender)
              ? "linear-gradient(45deg, #8e44ad, #3498db)"
              : "linear-gradient(45deg, #16a085, #f39c12)",
            borderRadius: "20px",
            maxWidth: "65%",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
          onClick={() =>
            !isCurrentUser(msg.sender) &&
            !msg.read &&
            markMessageAsRead(msg._id)
          }
        >
          {renderMessage(msg.message)}
          <Typography
            variant="caption"
            display="block"
            sx={{
              bottom: 5,
              right: 10,
              fontSize: "10px",
              opacity: 0.7,
            }}
          >
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Paper>
      </Box>
    ));
  }, [messages, isLoading, error, joinRoom, isCurrentUser, renderMessage, markMessageAsRead]);

  return (
    <Box>
      {/* Chat header */}
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          marginTop: "1vh",
          borderRadius: "2vh",
          border: "0.vw solid teal",
          backgroundColor: "white",
        }}
        elevation={10}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              background: "linear-gradient(135deg, #74ebd5, #ACB6E5)",
              color: "#34495e",
              width: 50,
              height: 50,
              fontSize: "1.3rem",
              fontWeight: "bold",
              boxShadow: "0px 4px 10px rgba(116, 235, 213, 0.5)",
              border: "2px solid #74ebd5",
            }}
          >
            {opponentName[0].toUpperCase()}
          </Avatar>
        </ListItemAvatar>

        <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
          {opponentName}
        </Typography>
      </Paper>

      {/* Chat messages */}
      <Box
        ref={chatBoxRef}
        sx={{
          height: "72vh",
          overflow: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          padding: 1,
        }}
      >
        {renderChatContent}
      </Box>

      {/* Message input */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          height: "100%",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "white",
          }}
          elevation={3}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
                e.preventDefault();
              }
            }}
            placeholder="Type a message..."
            InputProps={{
              sx: {
                borderRadius: "50px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
              },
            }}
          />
          <IconButton
            onClick={sendMessage}
            sx={{
              ml: 1,
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "black" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};

ChatComponent.propTypes = {
  opponentId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  opponentName: PropTypes.string.isRequired,
  productDetails: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string,
  }),
};

export default React.memo(ChatComponent);