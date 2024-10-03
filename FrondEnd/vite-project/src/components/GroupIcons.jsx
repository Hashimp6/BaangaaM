import { useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Message, Favorite, Star } from "@mui/icons-material";
import RightDrawer from "./MessageDrawer";
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
          }, {
            withCredentials: true 
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3200/store/add-to-favorite",
          {
            storeId: storeId,
          }, {
            withCredentials: true 
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
        width: "10vw",
        height: "15vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <IconButton
        sx={{ position: "absolute", top: "8px", right: "8px" }}
        onClick={(event) => handleDrawerOpen(event)}
      >
        <Message />
      </IconButton>
      <IconButton
        sx={{ position: "absolute", top: "8px", right: "50px" }}
        onClick={handleFavoriteToggle}
      >
        {isFavorite ? (
          <Favorite style={{ color: "red" }} />
        ) : (
          <FavoriteBorderIcon style={{ color: "black" }} />
        )}
      </IconButton>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: "2.8vh",
          right: "6.3vw",
        }}
      >
        <Star sx={{ color: "gold", fontSize: "20px" }} />
        <Typography
          variant="body2"
          sx={{
            color: "black",
            paddingLeft: "2px",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          4
        </Typography>
      </Box>
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
