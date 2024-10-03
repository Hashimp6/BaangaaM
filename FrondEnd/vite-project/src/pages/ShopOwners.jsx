import React, { useEffect, useState } from "react";
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
  Stack,
  Switch,
  TextField,
  Typography,
  Container,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchProductsRequest,
  fetchProductsSuccess,
} from "../redux/slices/product/products";
import RightDrawer from "../components/MessageDrawer";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ShopOwners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shopInfo = useSelector((state) => state.store.shopInfo);
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);

  const fetchProducts = async () => {
    try {
      dispatch(fetchProductsRequest());
      const response = await axios.get(
        `http://localhost:3200/product/allProducts/${shopInfo.email}`, {
          withCredentials: true 
        }
      );
      if (response.data) {
        dispatch(fetchProductsSuccess(response.data.data));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch, shopInfo.email]);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleStoreOpenChange = (event) => setIsOpen(event.target.checked);
  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);
  const handleAddProductClick = () => navigate("/addproduct");
  const handleEditClick = () => navigate("/storedatas");

  const handleDeleteProduct = async (id) => {
    try {
      console.log("starting delete");
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
          message: `Failed to delete product:`,
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container
      maxWidth="lg"
      sx={{ bgcolor: "background.default", color: "text.primary", py: 4 }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        {shopInfo.shopName
          ? `Welcome ${shopInfo.shopName}`
          : `Welcome ${shopInfo.name}`}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            display: "inline-flex",
            alignItems: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="body1" sx={{ mr: 2 }}>
            Store Status:
          </Typography>
          <Switch checked={isOpen} onChange={handleStoreOpenChange} />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {isOpen ? "Open" : "Closed"}
          </Typography>
        </Paper>
      </Box>

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
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            sx={{
              color: "teal",
              borderColor: "teal",
              "&:hover": {
                borderColor: "teal",
                bgcolor: "rgba(0, 128, 128, 0.04)",
              },
            }}
            startIcon={<AddIcon />}
            onClick={handleAddProductClick}
          >
            Add Product
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "teal", "&:hover": { bgcolor: "darkcyan" } }}
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            Edit Store Data
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "green", "&:hover": { bgcolor: "darkgreen" } }}
            startIcon={<MessageIcon />}
            onClick={handleOpenDrawer}
          >
            Messages
          </Button>
        </Stack>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
        <Table sx={{ minWidth: 700 }} aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}
              >
                Product Name & Brand
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}
              >
                Category
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}
              >
                Price
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}
              >
                Offer Price
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}
              >
                Image
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}
              >
                Actions
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}
              >
                Active
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product._id}
                sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.300" } }}
              >
                <TableCell component="th" scope="row">
                  {product.product_name} - {product.brandName}
                </TableCell>
                <TableCell align="center">{product.category}</TableCell>
                <TableCell align="center">${product.originalPrice}</TableCell>
                <TableCell align="center">
                  ${product.offerPrice || "-"}
                </TableCell>
                <TableCell align="center">
                  <img
                    src={product.image}
                    alt={product.productName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => alert(`Edit ${product.productName}`)}
                  >
                    <EditIcon sx={{ color: "black" }} />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={product.isActive}
                    onChange={() => {}}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RightDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        storeId={null}
        showchat={false}
        isAdmin={true}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ShopOwners;
