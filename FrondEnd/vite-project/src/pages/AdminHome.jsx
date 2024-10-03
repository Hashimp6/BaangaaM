import React from "react";
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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings"; // Settings icon
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Logout icon
import StoreIcon from "@mui/icons-material/Store";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import CategoryIcon from "@mui/icons-material/Category"; // Category icon
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminCatagory from "../components/AdminCatagory";
import StoreTable from "../components/AllStore";
import UserTable from "../components/AllUsers";

const drawerWidth = 240;

const AdminHome = () => {
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
            Admin Panel
          </Typography>
          <IconButton color="inherit">
            <Brightness4Icon />
          </IconButton>
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
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>

            {/* Stores Section */}
            <ListItem button>
              <ListItemIcon>
                <StoreIcon />
              </ListItemIcon>
              <ListItemText primary="Stores" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Category" />
            </ListItem>

            {/* Other Management Section */}
            <ListItem button>
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
            <ListItem button>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
            <ListItem button>
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
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>

            {/* Logout Section */}
            <ListItem button>
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
        <UserTable />
        <Typography paragraph>Dashboard content for /dashboard</Typography>
        <AdminCatagory />
        <StoreTable />
      </Box>
    </Box>
  );
};

export default AdminHome;
