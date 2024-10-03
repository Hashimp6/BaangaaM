import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { Avatar, IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatComponent from "./ChatComponent";
import ConversationList from "./ChatList";
import AssignmentIcon from "@mui/icons-material/Assignment";

const RightDrawer = ({
  open,
  onClose,
  storeId,
  storeName,
  showchat,
  isAdmin,
  productDetails,
}) => {
  const [chatScreen, setChatScreen] = useState("false");
  const [opponentId, setOpponentId] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  // useEffect to update chatScreen when showchat prop changes
  useEffect(() => {
    setOpponentId(storeId);
    setChatScreen(showchat);
    if (storeName) {
      setOpponentName(storeName);
    }
    console.log("opponent ", opponentId, storeId); // May not show updated opponentId immediately
  }, [showchat, storeId, storeName]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "40vw",
          height: "100vh",
          borderRadius: "10px",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            width: "100%",
            height: "50px",
            backgroundColor: "teal",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <Avatar
            variant="rounded"
            style={{ backgroundColor: "white" }}
            onClick={() => setChatScreen(false)}
          >
            <AssignmentIcon style={{ color: "teal" }} />
          </Avatar>
          <Typography variant="h5">Chats</Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <Paper
            sx={{
              alignItems: "center",
              height: "calc(100vh - 50px)",
              overflow: "hidden",
            }}
            elevation={3}
          >
            {chatScreen ? (
              <ChatComponent
                opponentId={opponentId}
                opponentName={opponentName}
                isAdmin={isAdmin}
                productDetails={productDetails}
                
              />
            ) : (
              <ConversationList
                setChatScreen={setChatScreen}
                setOpponentId={setOpponentId}
                setOpponentName={setOpponentName}
                isAdmin={isAdmin}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </Drawer>
  );
};

RightDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storeId: PropTypes.string.isRequired,
  showchat: PropTypes.bool,
  isAdmin: PropTypes.bool, // Optional prop
};

export default RightDrawer;
