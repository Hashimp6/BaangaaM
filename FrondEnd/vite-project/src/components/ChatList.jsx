import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ConversationList = ({
  setChatScreen,
  setOpponentId,
  setOpponentName,
  isAdmin,
}) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useSelector((state) => state.user?.userInfo);
  const userdd = userInfo ? userInfo._Id : null;
  const shopInfo = useSelector((state) => state.store.shopInfo);
  const shopdd = shopInfo ? shopInfo._id : null;
  console.log("userDD and shop dd ", userdd, shopdd);
  const userId = isAdmin ? shopdd : "66d7d20144b4f47cc5f8e8de";

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3200/chat/all_chats",
          { userId: userId }, {
            withCredentials: true 
          }
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          console.log("Conversations:", response.data.data);
          setConversations(response.data.data);
        } else {
          setConversations([]);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [userId, isAdmin]);

  const handleConversationClick = (conversationId, conversationName) => {
    setOpponentId(conversationId);
    setOpponentName(conversationName);
    setChatScreen(true);
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <List sx={{ padding: 0 }}>
          {conversations.length > 0 ? (
            conversations.map((conversation, index) => (
              <React.Fragment key={conversation._id || index}>
                <ListItem
                  alignItems="center"
                  button
                  onClick={() =>
                    handleConversationClick(
                      conversation.otherParticipantId,
                      conversation.otherParticipantName
                    )
                  }
                  sx={{
                    py: 2,
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <ListItemAvatar sx={{ mr: 2 }}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #00b09b, #96c93d)",
                        color: "#ffffff",
                        width: 56,
                        height: 56,
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        boxShadow: "0px 4px 10px rgba(0, 176, 155, 0.4)",
                        border: "2px solid #00b09b",
                      }}
                    >
                      {getInitials(conversation.otherParticipantName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          fontSize: "1.2rem",
                        }}
                      >
                        {conversation.otherParticipantName || "Unknown User"}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {"Last Message: "}
                        {new Date(conversation.lastActivity).toLocaleString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < conversations.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="No conversations found."
                sx={{ textAlign: "center", py: 4 }}
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

ConversationList.propTypes = {
  setChatScreen: PropTypes.func.isRequired,
  setOpponentId: PropTypes.func.isRequired,
  setOpponentName: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
};

export default ConversationList;
