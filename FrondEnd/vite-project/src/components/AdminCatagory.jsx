import React, { useState, useEffect } from "react";
import { Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Paper, Stack, Modal, Box, Snackbar, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddCategory from "./AddCatagory";
import axios from "axios";

function AdminCategory() {
  const [showAddShopCategory, setShowAddShopCategory] = useState(false);
  const [showAddProductCategory, setShowAddProductCategory] = useState(false);
  const [shopCategories, setShopCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = () => {
    fetchCategories("shop");
    fetchCategories("product");
  };

  const fetchCategories = async (type) => {
    try {
      const response = await axios.post("http://localhost:3200/catagory/all_catagory", { type }, {
        withCredentials: true 
      }
      );
      if (response.data.success) {
        if (type === "shop") {
          setShopCategories(response.data.data);
        } else {
          setProductCategories(response.data.data);
        }
      } else {
        showSnackbar(`Failed to fetch ${type} categories: ${response.data.message}`, "error");
      }
    } catch (error) {
      showSnackbar(`Error fetching ${type} categories: ${error.message}`, "error");
    }
  };

  const handleOpenAddShopCategory = () => setShowAddShopCategory(true);
  const handleCloseAddShopCategory = () => setShowAddShopCategory(false);
  const handleOpenAddProductCategory = () => setShowAddProductCategory(true);
  const handleCloseAddProductCategory = () => setShowAddProductCategory(false);

  const addCategory = async (newCategory, type) => {
    try {
      const response = await axios.post(
       " http://localhost:3200/catagory/add_catagory",
        newCategory, {
          withCredentials: true 
        }
      );
      if (response.data.success) {
        fetchCategories(type);
        showSnackbar(`${type} category added successfully`, "success");
      } else {
        showSnackbar(`Failed to add ${type} category: ${response.data.message}`, "error");
      }
    } catch (error) {
      showSnackbar(`Error adding ${type} category: ${error.message}`, "error");
    }
  };

  const deleteCategory = async (id, type) => {
    try {
      const response = await axios.post(
        "http://localhost:3200/catagory/delete_catagory",
        { id }, {
          withCredentials: true 
        }
      );
      if (response.data.success) {
        fetchCategories(type);
        showSnackbar(`${type} category deleted successfully`, "success");
      } else {
        showSnackbar(`Failed to delete category: ${response.data.message}`, "error");
      }
    } catch (error) {
      showSnackbar(`Error deleting category: ${error.message}`, "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const renderCategoryTable = (categories, type) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Sl No</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Image</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {categories.map((row, index) => (
          <TableRow key={row._id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{row.categoryName}</TableCell>
            <TableCell>
              <img
                src={row.categoryImage}
                alt={row.categoryName}
                width="50"
              />
            </TableCell>
            <TableCell align="right">
              <IconButton
                color="error"
                onClick={() => deleteCategory(row._id, type)}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Grid container spacing={3}>
      {/* Shops Section */}
      <Grid item xs={6}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ marginBottom: 2 }}
        >
          <Button
            variant="contained"
            onClick={handleOpenAddShopCategory}
            sx={{
              padding: (theme) => theme.spacing(1.5, 3),
              backgroundColor: "#008080",
              "&:hover": {
                backgroundColor: "#004d40",
              },
              color: "#fff",
            }}
          >
            <AddIcon sx={{ marginRight: 1 }} />
            Add Shop Category
          </Button>
        </Stack>
        <Paper elevation={4} sx={{ padding: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Shops
          </Typography>
          {renderCategoryTable(shopCategories, "shop")}
        </Paper>
      </Grid>

      {/* Products Section */}
      <Grid item xs={6}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ marginBottom: 2 }}
        >
          <Button
            variant="contained"
            onClick={handleOpenAddProductCategory}
            sx={{
              padding: (theme) => theme.spacing(1.5, 3),
              backgroundColor: "#008080",
              "&:hover": {
                backgroundColor: "#004d40",
              },
              color: "#fff",
            }}
          >
            <AddIcon sx={{ marginRight: 1 }} />
            Add Product Category
          </Button>
        </Stack>
        <Paper elevation={4} sx={{ padding: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Products
          </Typography>
          {renderCategoryTable(productCategories, "product")}
        </Paper>
      </Grid>

      {/* Modal for Add Shop Category */}
      <Modal
        open={showAddShopCategory}
        onClose={handleCloseAddShopCategory}
        aria-labelledby="add-shop-category-modal"
      >
        <Box sx={modalStyle}>
          <AddCategory
            onClose={handleCloseAddShopCategory}
            onAddCategory={(newCategory) => addCategory(newCategory, "shop")}
            categoryType="shop"
          />
        </Box>
      </Modal>

      {/* Modal for Add Product Category */}
      <Modal
        open={showAddProductCategory}
        onClose={handleCloseAddProductCategory}
        aria-labelledby="add-product-category-modal"
      >
        <Box sx={modalStyle}>
          <AddCategory
            onClose={handleCloseAddProductCategory}
            onAddCategory={(newCategory) => addCategory(newCategory, "product")}
            categoryType="product"
          />
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default AdminCategory;