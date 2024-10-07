import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import IconsBox from "./GroupIcons";

const LogoBox = ({ logo }) => (
  <Box
    sm={{ width: "100%" }}
    sx={{
      width: { xs: "18%", sm: "20%", md: "10vw" },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      component="img"
      src={logo}
      alt="Store Logo"
      sx={{
        height: { xs: "11vw", sm: "8vw" }, 
        borderRadius: "50%",
      }}
    />
  </Box>
);

const DetailsBox = ({ banner, name, address, phone, onClick }) => (
  <Box
    sx={{
      display: "flex",
      width: { xs: "55vw", sm: "55vw", md: "50vw" },
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
  const { storeId, banner, logo, name, address, phone, favorites } = store;

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "90%", md: "60vw" },
        height: { xs: "auto", sm: "auto", md: "20vh" },
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
      <IconsBox storeId={storeId} storeName={name} favorites={favorites} />
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

// import React from "react";
// import PropTypes from "prop-types";
// import { Box, Typography } from "@mui/material";
// import { LocationOn } from "@mui/icons-material";
// import IconsBox from "./GroupIcons";

// const LogoBox = ({ logo, logoSize = { xs: "80px", sm: "110px" } }) => (
//   <Box
//     sx={{
//       width: { xs: "25%", sm: "20%", md: "10vw" },
//       minWidth: { xs: "80px", sm: "100px" },
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: { xs: "10px", sm: "15px" },
//     }}
//   >
//     <img
//       src={logo}
//       alt="Store Logo"
//       style={{
//         width: "100%",
//         height: "100%",
//         maxHeight: logoSize,
//         maxWidth: logoSize,
//         borderRadius: "50%",
//         objectFit: "cover"
//       }}
//     />
//   </Box>
// );

// const DetailsBox = ({
//   banner,
//   name,
//   address,
//   phone,
//   onClick,
//   bannerHeight = { xs: "100px", sm: "auto" },
//   nameFontSize = { xs: "14px", sm: "16px", md: "20px" },
//   addressFontSize = { xs: "12px", sm: "14px" }
// }) => (
//   <Box
//     sx={{
//       flex: 1,
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//       alignItems: { xs: "flex-start", sm: "center" },
//       textAlign: { xs: "left", sm: "center" },
//       borderRadius: "8px",
//       padding: { xs: "10px", sm: "15px" },
//       overflow: "hidden",
//     }}
//     onClick={onClick}
//   >
//     {banner ? (
//       <Box
//         sx={{
//           width: "100%",
//           height: bannerHeight,
//           borderRadius: { xs: "4px", sm: "8px" },
//           overflow: "hidden",
//         }}
//       >
//         <img
//           src={banner}
//           alt="Banner"
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             display: "block",
//           }}
//         />
//       </Box>
//     ) : (
//       <>
//         <Typography
//           variant="h6"
//           sx={{
//             fontSize: nameFontSize,
//             fontWeight: "bold",
//             backgroundColor: "#f0f8ff",
//             padding: { xs: "4px 8px", sm: "8px" },
//             borderRadius: "4px",
//             width: "fit-content",
//             marginX: { xs: 0, sm: "auto" },
//           }}
//         >
//           {name}
//         </Typography>
//         <Typography
//           variant="body2"
//           color="textSecondary"
//           sx={{
//             marginTop: { xs: "4px", sm: "8px" },
//             fontSize: addressFontSize,
//             display: "flex",
//             alignItems: "center",
//             gap: "4px",
//           }}
//         >
//           <LocationOn sx={{
//             fontSize: { xs: "16px", sm: "18px" },
//             verticalAlign: "middle"
//           }} />
//           {address}
//         </Typography>
//       </>
//     )}
//   </Box>
// );

// const StoreCard = ({
//   store,
//   onClick,
//   cardWidth = { xs: "100%", sm: "90%", md: "60vw" },
//   cardHeight = { xs: "auto", sm: "auto", md: "20vh" },
//   cardMargin = { xs: "2vh auto", sm: "3vh auto", md: "5vh auto 3vh" },
//   logoSize,
//   bannerHeight,
//   nameFontSize,
//   addressFontSize
// }) => {
//   const { storeId, banner, logo, name, address, phone, favorites } = store;

//   return (
//     <Box
//       sx={{
//         width: cardWidth,
//         height: cardHeight,
//         display: "flex",
//         flexDirection: { xs: "column", sm: "row" },
//         borderRadius: { xs: "8px", sm: "12px" },
//         margin: cardMargin,
//         overflow: "hidden",
//         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "row", sm: "row" },
//           flex: 1,
//         }}
//       >
//         <LogoBox logo={logo} logoSize={logoSize} />
//         <DetailsBox
//           banner={banner}
//           name={name}
//           address={address}
//           phone={phone}
//           onClick={onClick}
//           bannerHeight={bannerHeight}
//           nameFontSize={nameFontSize}
//           addressFontSize={addressFontSize}
//         />
//       </Box>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: { xs: "flex-end", sm: "center" },
//           padding: { xs: "10px", sm: 0 },
//         }}
//       >
//         <IconsBox storeId={storeId} storeName={name} favorites={favorites} />
//       </Box>
//     </Box>
//   );
// };

// StoreCard.propTypes = {
//   store: PropTypes.shape({
//     storeId: PropTypes.string,
//     banner: PropTypes.string,
//     logo: PropTypes.string,
//     name: PropTypes.string,
//     address: PropTypes.string,
//     phone: PropTypes.string,
//     rating: PropTypes.number,
//     favorites: PropTypes.array,
//   }).isRequired,
//   onClick: PropTypes.func,
//   cardWidth: PropTypes.object,
//   cardHeight: PropTypes.object,
//   cardMargin: PropTypes.object,
//   logoSize: PropTypes.object,
//   bannerHeight: PropTypes.object,
//   nameFontSize: PropTypes.object,
//   addressFontSize: PropTypes.object,
// };

// export default StoreCard;
