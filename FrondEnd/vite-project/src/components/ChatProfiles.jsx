import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Paper,
  Stack,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";

const ChatProfiles = () => {
  //   const [conversations, setConversations] = useState([]);
  //   const [loading, setLoading] = useState(true);

  //   const userId = useSelector(useSelector((state) => state.user?.userInfo.userId));

  //   useEffect(() => {
  //     const fetchConversations = async () => {
  //       try {
  //         const response = await axios.get('http://localhost:3200/chat/all_chats', { userId }, {
     
  //         if (response.data && response.data.length > 0) {
  //           setConversations(response.data); // Set the conversations data
  //         } else {
  //           setConversations([]); // Empty conversations if no data
  //         }
  //       } catch (error) {
  //         console.error('Error fetching conversations:', error);
  //       } finally {
  //         setLoading(false); // Turn off loading spinner
  //       }
  //     };

  //     fetchConversations();
  //   }, [userId]);

  //   // If still loading, show loading message or spinner
  //   if (loading) {
  //     return <Typography>Loading conversations...</Typography>;
  //   }

  //   // If no conversations, show a Paper message
  //   if (conversations.length === 0) {
  //     return (
  //       <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
  //         <Typography>No conversation yet</Typography>
  //       </Paper>
  //     );
  //   }

  // If there are conversations, display them as cards
  return (
    <Box
      sx={{
        height: "92vh",
        overflow: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          margin: "1vh",
          marginTop: "1vh",
          borderRadius: "2vh",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
        elevation={3}
      >
        <Stack>
          <Typography variant="h6">Conversation with:</Typography>
          <Typography variant="body2">Last Message:</Typography>
        </Stack>
      </Paper>

      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "1vh",
          p: 2,
          marginTop: "1vh",
          borderRadius: "2vh",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
        elevation={3}
      >
        <Stack>
          <Typography variant="h6">Conversation with:</Typography>
          <Typography variant="body2">Last Message:</Typography>
        </Stack>
      </Paper>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "1vh",
          p: 2,
          marginTop: "1vh",
          borderRadius: "2vh",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
        elevation={3}
      >
        <Stack>
          <Typography variant="h6">Conversation with:</Typography>
          <Typography variant="body2">Last Message:</Typography>
        </Stack>
      </Paper>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "1vh",
          p: 2,
          marginTop: "1vh",
          borderRadius: "2vh",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
        elevation={3}
      >
        <Stack>
          <Typography variant="h6">Conversation with:</Typography>
          <Typography variant="body2">Last Message:</Typography>
        </Stack>
      </Paper>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "1vh",
          p: 2,
          marginTop: "1vh",
          borderRadius: "2vh",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
        elevation={3}
      >
        <Stack>
          <Typography variant="h6">Conversation with:</Typography>
          <Typography variant="body2">Last Message:</Typography>
        </Stack>
      </Paper>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "1vh",
          p: 2,
          marginTop: "1vh",
          borderRadius: "2vh",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
        elevation={3}
      >
        <Stack>
          <Typography variant="h6">Conversation with:</Typography>
          <Typography variant="body2">Last Message:</Typography>
        </Stack>
      </Paper>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "1vh",
          p: 2,
          marginTop: "1vh",
          borderRadius: "2vh",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
        elevation={3}
      >
        <Stack>
          <Typography variant="h6">Conversation with:</Typography>
          <Typography variant="body2">Last Message:</Typography>
        </Stack>
      </Paper>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "1vh",
          p: 2,
          marginTop: "1vh",
          borderRadius: "2vh",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
        elevation={3}
      >
        <Stack>
          <Typography variant="h6">Conversation with:</Typography>
          <Typography variant="body2">Last Message:</Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ChatProfiles;
