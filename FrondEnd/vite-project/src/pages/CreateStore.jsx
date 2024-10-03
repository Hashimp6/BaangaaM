import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Grid,
  Modal,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store"; // Ensure correct import
import CropImage from "../components/CropImage";
import axios from "axios";
import SelectedLocation from "../components/SelectedLocation";
import LocationFinder from "../components/LocationFind";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const StoreForm = () => {
  const navigate = useNavigate();
  const shopInfo = useSelector((state) => state.store.shopInfo);
  console.log("shop info is", shopInfo);

  const [features, setFeatures] = useState({
    cashOnDelivery: false,
    deliveryAvailable: false,
  });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [imageType, setImageType] = useState(""); // Added to handle image type
  const [croppedLogo, setCroppedLogo] = useState(null);
  const [croppedBanner, setCroppedBanner] = useState(null);
  const [geoLocation, setGeolocation] = useState(null);
  const [showLocation, setShowLocation] = useState(null);
  const [convertedAddress, setConvertedAddress] = useState("");
  const [formValues, setFormValues] = useState({
    shopName: "",
    shopId: "",
    location: "",
    address: "",
    phoneNumber: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
  });

  const handleFeatureChange = (event) => {
    setFeatures({
      ...features,
      [event.target.name]: event.target.checked,
    });
  };

  const handleFileChange = (event, type) => {
    setImageType(type); // Set image type
    if (type === "logo") {
      setLogo(URL.createObjectURL(event.target.files[0]));
    } else if (type === "banner") {
      setBanner(URL.createObjectURL(event.target.files[0]));
    }
    setModalOpen(true); // Open modal for cropping
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formValues.shopId) newErrors.shopId = "This field is essential";
    if (!formValues.shopName) newErrors.shopName = "This field is essential";
    if (!formValues.location) newErrors.location = "This field is essential";
    if (!formValues.address) newErrors.address = "This field is essential";
    if (!croppedLogo) newErrors.logo = "*Logo upload is essential";
    if (!croppedBanner) newErrors.banner = "*Banner upload is essential";
    if (!formValues.phoneNumber)
      newErrors.phoneNumber = "This field is essential";
    if (!/^\d{10}$/.test(formValues.phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append("storeEmail", shopInfo.email);
      formData.append("shopId", formValues.shopId);
      formData.append("shopName", formValues.shopName);
      formData.append("location", formValues.location);
      formData.append("address", formValues.address);
      formData.append("phoneNumber", formValues.phoneNumber);
      formData.append("whatsapp", formValues.whatsapp);
      formData.append("instagram", formValues.instagram);
      formData.append("facebook", formValues.facebook);
      formData.append("cashOnDelivery", features.cashOnDelivery);
      formData.append("deliveryAvailable", features.deliveryAvailable);
      formData.append("category", formValues.category);
      formData.append("logoURL", croppedLogo);
      formData.append("deliveryAvailable", features.deliveryAvailable);
      formData.append("bannerURL", croppedBanner);
      formData.append("GeoLocationLat", geoLocation.lat);
      formData.append("GeoLocationLng", geoLocation.lng);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      axios
        .post("http://localhost:3200/store/store_datas", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }, {
          withCredentials: true 
        })
        .then((response) => {
          console.log(response);
          navigate("/shopowners");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // Focus on the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      const field = document.querySelector(`[name="${firstErrorField}"]`);
      if (field) {
        field.focus();
      }
    }
  };

  useEffect(() => {
    if (geoLocation) {
      convertGeoToAddress(geoLocation);
    }
  }, [geoLocation]);

  const convertGeoToAddress = async (geoLocation) => {
    const { lat, lng } = geoLocation;
    const geocoder = new window.google.maps.Geocoder();

    try {
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK") {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });

      if (response && response.length > 0) {
        setConvertedAddress(response[0].formatted_address);
      } else {
        setConvertedAddress("No address found");
      }
    } catch (error) {
      console.error("Error converting geolocation to address:", error);
      setConvertedAddress("Unable to convert location to address");
    }
  };

  const handleClose = () => {
    imageType === "logo" ? setLogo(null) : setBanner(null);
    setModalOpen(false);
  };

  const handleImageCrop = (croppedImage) => {
    console.log(croppedImage);
    if (imageType === "logo") {
      setCroppedLogo(croppedImage);
    } else if (imageType === "banner") {
      setCroppedBanner(croppedImage);
    }
    setModalOpen(false);
  };

  return (
    <>
      {modalOpen && (
        <Modal open={open} onClose={handleClose}>
          <Box sx={{ p: 2 }}>
            <CropImage
              imageUrl={imageType === "logo" ? logo : banner}
              onCrop={handleImageCrop}
              onClose={handleClose}
              imageType={imageType}
            />
          </Box>
        </Modal>
      )}
      <Container
        maxWidth="lg"
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          backgroundColor: "#fff",
          width: { xs: "90%", sm: "80%", md: "70%" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "2px solid ",
            paddingBottom: "20px",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <StoreIcon
            sx={{
              fontSize: { xs: 50, sm: 60 },
              color: "#009688",
              marginRight: { xs: "0", sm: "10px" },
            }}
          />
          <Typography
            variant="h3"
            sx={{
              color: "#009688",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Store Details
          </Typography>
        </Box>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            required
            label="Shop ID"
            variant="outlined"
            name="shopId"
            value={formValues.shopId}
            onChange={handleChange}
            error={!!errors.shopId}
            helperText={errors.shopId}
          />
          <TextField
            fullWidth
            required
            label="Shop Name"
            variant="outlined"
            name="shopName"
            value={formValues.shopName}
            onChange={handleChange}
            error={!!errors.shopName}
            helperText={errors.shopName}
          />
          <TextField
            fullWidth
            required
            label="Location"
            variant="outlined"
            name="location"
            value={formValues.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
          />
          <TextField
            fullWidth
            required
            label="Address"
            variant="outlined"
            multiline
            rows={4}
            name="address"
            value={formValues.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />
          <div>
            <button
              onClick={() => setShowLocation("button1")}
              style={{
                backgroundColor: "#008080",
                color: "white",
                border: "none",
                padding: "10px 20px",
                margin: "5px",
                borderRadius: "5px",
                width: "20vw",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Mark shop Location
            </button>
            <button
              onClick={() => setShowLocation("button2")}
              style={{
                backgroundColor: "#008080",
                color: "white",
                border: "none",
                width: "22vw",
                padding: "10px 20px",
                margin: "5px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Set Live location as Shop location
            </button>
          </div>
          {showLocation === "button1" ? (
            <SelectedLocation
              setGeolocation={setGeolocation}
              setShowLocation={setShowLocation}
            />
          ) : (
            ""
          )}
          {showLocation === "button2" ? (
            <LocationFinder
              setGeolocation={setGeolocation}
              setShowLocation={setShowLocation}
            />
          ) : (
            ""
          )}
          {convertedAddress ? <p>{convertedAddress}</p> : ""}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                type="tel"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="WhatsApp Link"
                variant="outlined"
                type="url"
                name="whatsapp"
                value={formValues.whatsapp}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instagram Link"
                variant="outlined"
                type="url"
                name="instagram"
                value={formValues.instagram}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Facebook Link"
                variant="outlined"
                type="url"
                name="facebook"
                value={formValues.facebook}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Features
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={features.cashOnDelivery}
                  onChange={handleFeatureChange}
                  name="cashOnDelivery"
                />
              }
              label="Cash on Delivery"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={features.deliveryAvailable}
                  onChange={handleFeatureChange}
                  name="deliveryAvailable"
                />
              }
              label="Delivery Available"
            />
          </FormGroup>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={formValues.category || ""}
              label="Category"
              name="category"
              onChange={handleChange}
            >
              <MenuItem value="Grocery">Grocery</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Fashion">Fashion</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Upload Images
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", sm: "100px" }, // Adjust size as needed
                height: { xs: "150px", sm: "100px" }, // Square shape
                border: "2px dashed #009688",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundImage: `url(${croppedLogo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => document.getElementById("logo-upload").click()}
            >
              {!croppedLogo && (
                <Typography color="textSecondary">Upload Logo</Typography>
              )}
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, "logo")}
              />
            </Box>
            {errors.logo && (
              <Typography variant="body2" color="error">
                {errors.logo}
              </Typography>
            )}
            <Box
              sx={{
                width: { xs: "100%", sm: "300px" }, // Adjust size as needed
                height: { xs: "200px", sm: "60px" }, // Rectangle shape
                border: "2px dashed #009688",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundImage: `url(${croppedBanner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => document.getElementById("banner-upload").click()}
            >
              {!croppedBanner && (
                <Typography color="textSecondary">Upload Banner</Typography>
              )}
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, "banner")}
              />
            </Box>
            {errors.banner && (
              <Typography variant="body2" color="error">
                {errors.banner}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              mt: 3,
              backgroundColor: "#009688",
              "&:hover": {
                backgroundColor: "tomato",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default StoreForm;
