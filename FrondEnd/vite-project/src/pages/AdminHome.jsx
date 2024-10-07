import React, { useState } from "react";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import StoreIcon from "@mui/icons-material/Store";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import CategoryIcon from "@mui/icons-material/Category";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminCatagory from "../components/AdminCatagory";
import StoreTable from "../components/AllStore";
import UserTable from "../components/AllUsers";
import { adminLogout } from "../redux/slices/admin/adminSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AdminHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'users':
        return <UserTable />;
      case 'stores':
        return <StoreTable />;
      case 'category':
        return <AdminCatagory />;
      case 'dashboard':
      default:
        return <Typography paragraph>Dashboard content for /dashboard</Typography>;
    }
  };

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/adminLogin");
  };

  const drawer = (
    <Box sx={{ overflow: "auto" }}>
      <List>
        <ListItem button onClick={() => { setActiveContent('dashboard'); if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => { setActiveContent('users'); if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button onClick={() => { setActiveContent('stores'); if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText primary="Stores" />
        </ListItem>
        <ListItem button onClick={() => { if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button onClick={() => { setActiveContent('category'); if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Category" />
        </ListItem>
        <ListItem button onClick={() => { if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <ManageAccountsIcon />
          </ListItemIcon>
          <ListItemText primary="Other Management" />
        </ListItem>
      </List>
      <Typography variant="subtitle2" sx={{ pl: 2, mt: 2, mb: 1 }}>
        Analytics
      </Typography>
      <List>
        <ListItem button onClick={() => { if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
        <ListItem button onClick={() => { if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Integrations" />
        </ListItem>
      </List>
      <Typography variant="subtitle2" sx={{ pl: 2, mt: 2, mb: 1 }}>
        Admin
      </Typography>
      <List>
        <ListItem button onClick={() => { if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button onClick={() => { handleLogout(); if (isMobile) handleDrawerToggle(); }}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <IconButton color="inherit">
            <Brightness4Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminHome;