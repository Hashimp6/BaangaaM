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
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ChatIcon from "@mui/icons-material/Chat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import appLogo from "../../public/pics/appLogo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getCoordinates } from "../redux/slices/users/usersSlic";
import RightDrawer from "./MessageDrawer";
import { useNavigate } from "react-router-dom";

const pages = ["Home", "Shops", "Product", "Contact Us"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [location, setLocation] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          console.log(coords);
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

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleCart=()=> navigate('/cart')

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
    console.log(suggestion.description);
    geocodeAddress(suggestion.description);
  };

  const geocodeAddress = (address) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        const coords = { lat: lat(), lng: lng() };
        dispatch(getCoordinates(coords));
        console.log(coords);
      } else {
        console.error(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAWdpzsOIeDYSG76s3OncbRHmm5pBwiG24`
      , {
        withCredentials: true 
      });
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

  
  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
  };

  return (
    <AppBar position="static" sx={{ height: "10vh", backgroundColor: "teal" }}>
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
            <img
              src={appLogo}
              alt="Logo"
              style={{ width: "150px", height: "auto", borderRadius: "5px" }}
            />
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

       

          {/* User settings and notifications */}
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar
                  alt="User Avatar"
                  src="/static/images/avatar/2.jpg"
                  sx={{ width: 30, height: 30, marginRight: 5 }}
                />
              </IconButton>
            </Tooltip>
               {/* Location Search */}
          <IconButton onClick={handleOpenDialog}>
            <LocationOnIcon
              sx={{ color: "white", marginRight: "1.5vw", cursor: "pointer" }}
            />
          </IconButton>
            <IconButton
              size="large"
              aria-label="show cart items"
              color="inherit"
              onClick={handleCart}
            >
              <Badge badgeContent={4} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleChatOpen} size="large" aria-label="open chat" color="inherit">
              <Badge badgeContent={17} color="error">
                <ChatIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* User Menu */}
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={handleCloseUserMenu}>
            <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>


      <RightDrawer 
  open={chatOpen} 
  onClose={handleChatClose} 
  storeId={null} 
  showchat={false} 
/>

   


      {/* Location Search Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
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
            <ul>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export default NavBar;
