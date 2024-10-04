import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ChatIcon from "@mui/icons-material/Chat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import appLogo from "../../public/pics/appLogo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getCoordinates, logout } from "../redux/slices/users/usersSlic";
import RightDrawer from "./MessageDrawer";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserProfile";

const pages = ["Home", "Shops", "Product", "Contact Us"];
const settings = ["Profile", "Logout"];

function NavBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [location, setLocation] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo?.user);
 

  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteRef.current =
        new window.google.maps.places.AutocompleteService();
      geocoderRef.current = new window.google.maps.Geocoder();
    }
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = { lat: latitude, lng: longitude };
          dispatch(getCoordinates(coords));
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Unable to get location");
        }
      );
    } else {
      setLocation("Geolocation is not supported by this browser");
    }
  };

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleLocationDialogOpen = () => setLocationDialogOpen(true);
  const handleLocationDialogClose = () => setLocationDialogOpen(false);
  const handleCart = () => navigate("/cart");
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
 

  const handleSearchLocation = async (input) => {
    if (!input || !autocompleteRef.current) return;
    try {
      const { predictions } = await new Promise((resolve, reject) => {
        autocompleteRef.current.getPlacePredictions(
          { input },
          (predictions, status) => {
            if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
              reject(status);
            } else {
              resolve({ predictions });
            }
          }
        );
      });
      setSuggestions(predictions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    handleSearchLocation(value);
  };

  const handleSelectSuggestion = (suggestion) => {
    setLocation(suggestion.description);
    setSuggestions([]);
    geocodeAddress(suggestion.description);
  };

  const geocodeAddress = (address) => {
    if (!geocoderRef.current) return;
    geocoderRef.current.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        const coords = { lat: lat(), lng: lng() };
        dispatch(getCoordinates(coords));
      }
    });
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAWdpzsOIeDYSG76s3OncbRHmm5pBwiG24`,
        { withCredentials: true }
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setLocation(data.results[0].formatted_address);
      } else {
        setLocation("Address not found");
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      setLocation("Error getting address");
    }
  };

  const handleChatOpen = () => setChatOpen(true);
  const handleChatClose = () => setChatOpen(false);

  return (
    <AppBar position="static" sx={{ height: "10vh", backgroundColor: "teal" }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="start"
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={appLogo}
              alt="Logo"
              style={{
                width: isMobile ? "100px" : "150px",
                height: "auto",
                borderRadius: "5px",
              }}
            />
          </Box>

          {/* Desktop Navigation Menu */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              {pages.map((page) => (
                <Button key={page} sx={{ color: "white" }}>
                  {page}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side icons */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar
                  sx={{ width: 30, height: 30 }}
                >{userInfo?.name ? userInfo.name[0].toUpperCase() : 'U'}
        </Avatar>
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleLocationDialogOpen}>
              <LocationOnIcon sx={{ color: "white" }} />
            </IconButton>

            <IconButton onClick={handleCart}>
              <Badge badgeContent={4} color="error">
                <ShoppingCartIcon sx={{ color: "white" }} />
              </Badge>
            </IconButton>
            <IconButton onClick={handleChatOpen}>
              <Badge badgeContent={17} color="error">
                <ChatIcon sx={{ color: "white" }} />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer anchor="left" open={mobileMenuOpen} onClose={toggleMobileMenu}>
        <List sx={{ width: 250 }}>
          {pages.map((page) => (
            <ListItem button key={page}>
              <ListItemText primary={page} />
            </ListItem>
          ))}
          {isMobile && (
            <ListItem button onClick={handleLocationDialogOpen}>
              <ListItemText primary="Set Location" />
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* User Menu */}
      <UserMenu 
          anchorElUser={anchorElUser}
          handleCloseUserMenu={handleCloseUserMenu}
        />

      {/* Chat Drawer */}
      <RightDrawer
        open={chatOpen}
        onClose={handleChatClose}
        storeId={null}
        showchat={false}
      />

      {/* Location Dialog */}
      <Dialog open={locationDialogOpen} onClose={handleLocationDialogClose}>
        <DialogTitle>Location Search</DialogTitle>
        <DialogContent>
          <Button variant="outlined" onClick={getCurrentLocation}>
            Set Current Location
          </Button>
          <TextField
            autoFocus
            margin="dense"
            id="location"
            label="Enter Location"
            type="text"
            fullWidth
            value={location}
            onChange={handleLocationChange}
          />
          {suggestions.length > 0 && (
            <List>
              {suggestions.map((suggestion) => (
                <ListItem
                  button
                  key={suggestion.place_id}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <ListItemText primary={suggestion.description} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLocationDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export default NavBar;
