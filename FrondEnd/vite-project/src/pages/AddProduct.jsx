import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  OutlinedInput,
  InputAdornment,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";
import CropImage from "../components/CropImage";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddProductForm = () => {
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    productName: "",
    category: "",
    brandName: "",
    description: "",
    originalPrice: "",
    offerPrice: "",
    tags: [],
  });
  const navigate = useNavigate();

  const shopInfo = useSelector((state) => state.store.shopInfo);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formValues.productName)
      newErrors.productName = "Product name is essential";
    if (!formValues.category) newErrors.category = "Category is essential";
    if (!formValues.brandName) newErrors.brandName = "This field is essential";
    if (!image) newErrors.image = "*Image upload is essential";
    if (!formValues.offerPrice || isNaN(formValues.offerPrice)) {
      newErrors.offerPrice =
        "Offer price is essential and should be a valid number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFormValues({
      productName: "",
      category: "",
      brandName: "",
      description: "",
      originalPrice: "",
      offerPrice: "",
      tags: [],
    });
    setCroppedImage(null);
    setImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const formFields = {
        email: shopInfo.email,
        productName: formValues.productName.trim(),
        category: formValues.category.trim(),
        brandName: formValues.brandName.trim(),
        description: formValues.description.trim(),
        originalPrice: formValues.originalPrice.trim(),
        offerPrice: formValues.offerPrice.trim(),
        tags: formValues.tags,
        image: croppedImage,
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_Backend_api}/product/addProduct`,
          formFields, {
            withCredentials: true 
          }
        );
        if (response) {
          console.log("Form Data Submitted:", response.data);
          navigate("/shopowners");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSnackbarOpen(true);
        clearForm();
      }
    } else {
      const firstErrorField = Object.keys(errors)[0];
      const field = document.querySelector(`[name="${firstErrorField}"]`);
      if (field) {
        field.focus();
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
        setModalOpen(true);
        setErrors({ ...errors, image: null });
      } else {
        setErrors({ ...errors, image: "Please upload a valid image file." });
      }
    }
  };

  const handleClose = () => {
    setImage(null);
    setModalOpen(false);
  };

  const handleImageCrop = (croppedImage) => {
    setCroppedImage(croppedImage);
    setModalOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      {modalOpen && (
        <Modal open={modalOpen} onClose={handleClose}>
          <Box sx={{ p: 2 }}>
            <CropImage
              imageUrl={URL.createObjectURL(image)}
              onCrop={handleImageCrop}
              onClose={handleClose}
              imageType={"logo"}
            />
          </Box>
        </Modal>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          Couldnt add product. Please try again later.
        </Alert>
      </Snackbar>
      <Container
        maxWidth="lg"
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          backgroundColor: "#fff",
          width: { xs: "90%", sm: "80%", md: "55%" },
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
          <ShoppingBag
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
            Add Product
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
            label="Product Name"
            variant="outlined"
            name="productName"
            value={formValues.productName}
            onChange={handleChange}
            error={!!errors.productName}
            helperText={errors.productName}
          />

<FormControl fullWidth variant="outlined" error={!!errors.category}>
  <InputLabel>Category</InputLabel>
  <Select
    name="category"
    value={formValues.category}
    onChange={handleChange}
    label="Category"
  >
    <MenuItem value="food">Food</MenuItem>
    <MenuItem value="vegetable">Vegetable</MenuItem>
    <MenuItem value="grocery">Grocery</MenuItem>
    <MenuItem value="fruits">Fruits</MenuItem>
    <MenuItem value="meat">Meat</MenuItem>
  </Select>
  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
</FormControl>

          <TextField
            fullWidth
            label="Brand Name"
            variant="outlined"
            name="brandName"
            value={formValues.brandName}
            onChange={handleChange}
            error={!!errors.brandName}
            helperText={errors.brandName}
          />

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            name="description"
            value={formValues.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="original-price">Original Price</InputLabel>
                <OutlinedInput
                  id="original-price"
                  startAdornment={
                    <InputAdornment position="start">Rs</InputAdornment>
                  }
                  label="Original Price"
                  value={formValues.originalPrice}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      originalPrice: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="offer-price">Offer Price</InputLabel>
                <OutlinedInput
                  id="offer-price"
                  startAdornment={
                    <InputAdornment position="start">Rs</InputAdornment>
                  }
                  label="Offer Price"
                  value={formValues.offerPrice}
                  onChange={(e) =>
                    setFormValues({ ...formValues, offerPrice: e.target.value })
                  }
                  error={!!errors.offerPrice}
                />
                {errors.offerPrice && (
                  <Typography variant="body2" color="error">
                    {errors.offerPrice}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
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
                width: { xs: "100%", sm: "15vw" }, // Adjust size as needed
                height: { xs: "40vh", sm: "15vw" }, // Square shape
                border: "2px dashed #009688",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundImage: `url(${croppedImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => document.getElementById("image-upload").click()}
            >
              {!croppedImage && (
                <Typography color="textSecondary">Add Image</Typography>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e)=> handleFileChange(e)}
              />
            </Box>
            {errors.image && (
              <Typography variant="body2" color="error">
                {errors.image}
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

export default AddProductForm;
