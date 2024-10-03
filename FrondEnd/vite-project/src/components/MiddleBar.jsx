import { Box, Divider, Typography } from "@mui/material";
import StoreCard from "./StoreCards"; // Ensure the import path is correct
import backgroundImage from "../../public/pics/storehero.png";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchedStores, setSelectedShop } from "../redux/slices/store/storesSlice";
function MiddleBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const coordinates = useSelector((state) => state.user?.userLocation);
  const stores = useSelector((state) => state.store.shops); // Access stores from Redux state

  useEffect(() => {
    const fetchStores = async () => {
      if (!coordinates) return;
      try {
        const response = await axios.post(
          "http://localhost:3200/store/near_stores",
          coordinates, {
            withCredentials: true 
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
        width: "80vw",
        height: "90vh",
        paddingLeft: "2vw",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box
        sx={{
          width: "60vw",
          height: "60vh",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px",
          marginBottom: "30px",
          borderRadius: "1vw",
        }}
      >
        {/* Quote Box at the bottom-left */}
        <Box
          sx={{
            position: "absolute",
            bottom: "4vh",
            left: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black background
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            maxWidth: "40vw", // Adjust to your needs
          }}
        >
          <Typography variant="h4">
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
      <Divider sx={{ width: "60vw", padding: "2vh" }} />
      {stores.length === 0 ? (
        <p>No stores found within the specified range.</p>
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
  );
}

export default MiddleBar;
