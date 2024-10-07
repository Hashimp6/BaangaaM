import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import StoreCard from "./StoreCards"; // Ensure the import path is correct
import backgroundImage from "../../public/pics/storehero.png";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchedStores,
  setSelectedShop,
} from "../redux/slices/store/storesSlice";

function MiddleBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const coordinates = useSelector((state) => state.user?.userLocation);
  const stores = useSelector((state) => state.store.shops);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchStores = async () => {
      if (!coordinates) return;
      try {
        const response = await axios.post(
          "http://localhost:3200/store/near_stores",
          coordinates,
          {
            withCredentials: true,
          }
        );
        if (response && response.data.data) {
          dispatch(fetchedStores(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, [coordinates, dispatch]);

  const handleStoreClick = (storeItem) => {
    console.log("clicked", storeItem);
    dispatch(setSelectedShop(storeItem));
    navigate("/products");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "auto", md: "90vh" },
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        padding: { xs: 0, sm: "0 3vw", md: "0 2vw" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: { xs: "30vh", sm: "50vh", md: "60vh" },
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: { xs: 0, sm: "20px", md: "30px" },
          marginBottom: { xs: "5px", sm: "20px", md: "30px" },
          borderRadius: { xs: 0, sm: "1.5vw", md: "1vw" },
        }}
      >
        {/* Quote Box at the bottom-left */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "2vh", sm: "3vh", md: "4vh" },
            left: { xs: "10px", sm: "15px", md: "20px" },
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: { xs: "5px 10px", sm: "8px 15px", md: "10px 20px" },
            borderRadius: "8px",
            maxWidth: { xs: "90%", sm: "60vw", md: "40vw" },
          }}
        >
          <Typography variant={isMobile ? "h6" : "h4"}>
            Everything around you is here. Make a click and do it
          </Typography>
          <Typography
            variant="body2"
            sx={{ marginTop: "5px", textAlign: "right" }}
          >
            BaangaaM
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ width: "100%", padding: "1.5vh" }} />
      <Box sx={{ padding: { xs: "0 10px", sm: 0 } }}>
        {stores.length === 0 ? (
          <Typography>No stores found within the specified range.</Typography>
        ) : (
          stores.map((storeItem) => (
            <StoreCard
              key={storeItem.id}
              store={{
                storeId: storeItem.shop._id,
                banner: storeItem.shop.banner,
                logo: storeItem.shop.logo,
                name: storeItem.shop.shopName,
                address: storeItem.shop.address,
                phone: storeItem.shop.phone,
                favorites: storeItem.shop.isFavorite,
              }}
              onClick={() => handleStoreClick(storeItem.shop)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

export default MiddleBar;
