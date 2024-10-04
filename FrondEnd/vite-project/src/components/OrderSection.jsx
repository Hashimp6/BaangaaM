import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Button,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import axios from "axios";

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const shopInfo = useSelector((state) => state.store.shopInfo);

  useEffect(() => {
    fetchOrders();
  }, [shopInfo.email]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3200/orders/${shopInfo.email}`,
        { withCredentials: true }
      );
      if (response.data) {
        setOrders(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Orders</Typography>
        <TextField
          size="small"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: "background.paper" }}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Order Number
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Customer Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Order Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Total Amount
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", bgcolor: "black" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order._id} sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.300" } }}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ mr: 1, bgcolor: "teal", "&:hover": { bgcolor: "darkcyan" } }}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        color: "teal", 
                        borderColor: "teal",
                        "&:hover": {
                          borderColor: "teal",
                          bgcolor: "rgba(0, 128, 128, 0.04)",
                        },
                      }}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersSection;