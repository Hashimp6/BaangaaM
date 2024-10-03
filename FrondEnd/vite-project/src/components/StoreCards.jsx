import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Typography } from "@mui/material";
import { Phone, LocationOn } from "@mui/icons-material";
import IconsBox from "./GroupIcons";

const LogoBox = ({ logo }) => (
  <Box
    sx={{
      width: "10vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img
      src={logo}
      alt="Store Logo"
      style={{ height: "110px", borderRadius: "50%" }}
    />
  </Box>
);

const DetailsBox = ({ banner, name, address, phone, onClick }) => (
  <Box
    sx={{
      flex: "2 1 0",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      borderRadius: "8px",
      paddingLeft: "0.5vw",
      paddingRight: "0.5vw",
    }}
    onClick={onClick}
  >
    {banner ? (
      <img
        src={banner}
        alt="Banner"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "1vw",
          display: "block",
        }}
      />
    ) : (
      <>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            backgroundColor: "#f0f8ff",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: "8px" }}
        >
          <LocationOn sx={{ verticalAlign: "middle" }} /> {address}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: "8px" }}
        ></Typography>
      </>
    )}
  </Box>
);

const StoreCard = ({ store, onClick }) => {
  const { storeId, banner, logo, name, address, phone,favorites } = store;

  return (
    <Box
      sx={{
        width: "60vw",
        height: "20vh",
        display: "flex",
        borderRadius: "8px",
        marginTop: "5vh",
        marginBottom: "3vh",
        overflow: "hidden",
        boxShadow: "0 0 10px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      <LogoBox logo={logo} />
      <DetailsBox
        banner={banner}
        name={name}
        address={address}
        phone={phone}
        onClick={onClick}
      />
      <IconsBox storeId={storeId} storeName={name} favorites={favorites}/>
    </Box>
  );
};

StoreCard.propTypes = {
  store: PropTypes.shape({
    storeId: PropTypes.string.isRequired,
    banner: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
};

export default StoreCard;
