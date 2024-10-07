import { useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import RightDrawer from "./MessageDrawer";
import { Message, Favorite, FavoriteBorder, Star } from "@mui/icons-material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";

const IconsBox = ({ storeId, storeName, favorites }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(favorites);

  const handleDrawerOpen = (event) => {
    event.stopPropagation();
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleFavoriteToggle = async (event) => {
    event.stopPropagation();
    try {
      let response;
      if (isFavorite) {
        response = await axios.post(
          "http://localhost:3200/store/remove-from-favorite",
          {
            storeId: storeId,
          },
          {
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3200/store/add-to-favorite",
          {
            storeId: storeId,
          },
          {
            withCredentials: true,
          }
        );
      }

      if (response) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "20vw", sm: "10vw" }, // Increase width on mobile for better tap targets
        height: { xs: "8vh", sm: "10vh" }, // Decrease height on mobile
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Message icon */}
      <IconButton
        sx={{
          position: "absolute",
          top: { xs: "4px", sm: "8px" }, // Adjust top position for mobile
          right: { xs: "0px", sm: "8px" }, // Adjust right position for mobile
        }}
        onClick={(event) => handleDrawerOpen(event)}
      >
        <Message sx={{ fontSize: { xs: "15px", sm: "25px" } }} />
      </IconButton>

      {/* Favorite icon */}
      <IconButton
        sx={{
          position: "absolute",
          top: { xs: "4px", sm: "8px" }, // Adjust top position for mobile
          right: { xs: "25px", sm: "50px" }, // Adjust right position for mobile
        }}
        onClick={handleFavoriteToggle}
      >
        {isFavorite ? (
          <Favorite
            sx={{ color: "red", fontSize: { xs: "15px", sm: "25px" } }}
          />
        ) : (
          <FavoriteBorder
            sx={{ color: "black", fontSize: { xs: "15px", sm: "25px" } }}
          />
        )}
      </IconButton>

      {/* Rating section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: { xs: "1.2vh", sm: "2.8vh" }, // Adjust top position for mobile
          right: { xs: "13vw", sm: "6.3vw" }, // Adjust right position for mobile
        }}
      >
        <Star sx={{ color: "gold", fontSize: { xs: "15px", sm: "25px" } }} />
        <Typography
          variant="body2"
          sx={{
            color: "black",
            paddingLeft: "2px",
            fontSize: { xs: "12px", sm: "14px" }, // Adjust font size for mobile
            fontWeight: "700",
          }}
        >
          4
        </Typography>
      </Box>

      {/* Drawer for chat */}
      <RightDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        storeId={storeId}
        storeName={storeName}
        showchat={true}
      />
    </Box>
  );
};

export default IconsBox;
