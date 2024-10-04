import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Paper,
  Switch,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Inventory as InventoryIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsRequest,
  fetchProductsSuccess,
} from "../redux/slices/product/products";
import RightDrawer from "../components/MessageDrawer";
import ProductSection from "../components/ProductSection";
import OrdersSection from "../components/OrderSection";
import axios from "axios";
import { storeLogout } from "../redux/slices/store/storesSlice";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const drawerWidth = 240;

const ShopOwner = () => {
  const [activeContent, setActiveContent] = useState('dashboard');
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


  const handleLogout = () => {
    dispatch(storeLogout());
    navigate("/storelogin"); // Adjust this route as needed
  };
  const fetchProducts = async () => {
    try {
      dispatch(fetchProductsRequest());
      const response = await axios.get(
        `http://localhost:3200/product/allProducts/${shopInfo.email}`,
        { withCredentials: true }
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

  const handleStoreOpenChange = (event) => setIsOpen(event.target.checked);
  const handleMessageDrawer = () => setDrawerOpen(!drawerOpen);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'products':
        return (
          <ProductSection 
            products={products}
            fetchProducts={fetchProducts}
            setSnackbar={setSnackbar}
          />
        );
      case 'orders':
        return <OrdersSection />;
      case 'dashboard':
      default:
        return (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Dashboard Overview</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Paper elevation={3} sx={{ p: 2, flex: 1, mr: 2 }}>
                <Typography variant="h6">Total Products</Typography>
                <Typography variant="h4">{products.length}</Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 2, flex: 1, mr: 2 }}>
                <Typography variant="h6">Total Orders</Typography>
                <Typography variant="h4">0</Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6">Revenue</Typography>
                <Typography variant="h4">$0</Typography>
              </Paper>
            </Box>
          </Paper>
        );
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "teal",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {shopInfo.shopName ? shopInfo.shopName : shopInfo.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Store Status:
            </Typography>
            <Switch checked={isOpen} onChange={handleStoreOpenChange} />
            <IconButton color="inherit" onClick={handleMessageDrawer}>
              <MessageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button onClick={() => setActiveContent('dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => setActiveContent('products')}>
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem button onClick={() => setActiveContent('orders')}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={() => navigate("/storehome")}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Store Settings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
      
      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
    </Box>
  );
};

export default ShopOwner;