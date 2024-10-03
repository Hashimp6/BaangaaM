import React, { useState } from "react";
import { TextField, Button, Stack, Typography, Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[100],
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
  },
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5),
    color: theme.palette.text.primary,
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
    "&.Mui-focused": {
      color: "#000",
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#008080",
  "&:hover": {
    backgroundColor: "#004d40",
  },
  color: "#fff",
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AddCategory({ onClose, onAddCategory, categoryType }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setCategoryImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    } else {
      setCategoryImage(null);
      setPreviewUrl("");
      setError("Please select a valid image file.");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddCategory = async () => {
    if (categoryName && categoryImage) {
      setIsLoading(true);
      setError("");
      try {
        const base64Image = await convertToBase64(categoryImage);
        
        const newCategory = {
          categoryName,
          categoryImage: base64Image,
          categoryType,
        };

        await onAddCategory(newCategory);
        onClose();
      } catch (error) {
        console.error("Error adding category:", error);
        setError("Failed to add category. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please provide both a category name and an image.");
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Add New {categoryType} Category
      </Typography>
      <Stack spacing={3}>
        <StyledTextField
          label="Category Name"
          variant="outlined"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
          error={!!error}
        />
        <Box textAlign="center">
          <StyledButton
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ marginBottom: 2 }}
          >
            Upload Image
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </StyledButton>
          {previewUrl && (
            <Box
              sx={{
                width: 150,
                height: 150,
                margin: "auto",
                backgroundImage: `url(${previewUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 2,
              }}
            />
          )}
        </Box>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <StyledButton variant="outlined" onClick={onClose}>
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleAddCategory}
            disabled={!categoryName || !categoryImage || isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Add Category"}
          </StyledButton>
        </Stack>
      </Stack>
    </Box>
  );
}

export default AddCategory;