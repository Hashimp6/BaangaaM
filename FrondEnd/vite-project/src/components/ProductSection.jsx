import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductSection = ({ products, fetchProducts, setSnackbar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleAddProductClick = () => navigate("/addproduct");

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3200/product/delete/${id}`
      );
      if (response.data.success) {
        await fetchProducts();
        setSnackbar({
          open: true,
          message: "Product deleted successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: `Failed to delete product`,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setSnackbar({
        open: true,
        message: `Error deleting product: ${error.message}`,
        severity: "error",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: "background.paper" }}
        />
        <Button
          variant="contained"
          sx={{ bgcolor: "teal", "&:hover": { bgcolor: "darkcyan" } }}
          startIcon={<AddIcon />}
          onClick={handleAddProductClick}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
        <Table sx={{ minWidth: 700 }} aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Product Name & Brand
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Category
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Price
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Offer Price
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Image
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Actions
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Active
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.300" } }}>
                <TableCell component="th" scope="row">
                  {product.product_name} - {product.brandName}
                </TableCell>
                <TableCell align="center">{product.category}</TableCell>
                <TableCell align="center">${product.originalPrice}</TableCell>
                <TableCell align="center">${product.offerPrice || "-"}</TableCell>
                <TableCell align="center">
                  <img
                    src={product.image}
                    alt={product.productName}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => alert(`Edit ${product.productName}`)}>
                    <EditIcon sx={{ color: "black" }} />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteProduct(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <Switch checked={product.isActive} onChange={() => {}} color="primary" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProductSection;