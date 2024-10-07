import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "../redux/slices/cart/cartSlice";
import { updateUserInfo } from "../redux/slices/users/usersSlic"; // Make sure to import this
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Grid,
  Divider,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Navigate } from "react-router-dom";
import RazorpayPayment from "./PaymentCreate";
import PaymentStatus from "./PaymentStatus";

const Cart = () => {
  const dispatch = useDispatch();
  const [cart, setLocalCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [addressUpdateStatus, setAddressUpdateStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Get user info from Redux store
  const userInfo = useSelector((state) => state.user.userInfo);
  console.log("userInfo fromcaryt", userInfo);
  const userId = userInfo?.user._id;
  console.log("Address",userInfo.user.address);

  const fetchCart = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:3200/product/allcart/${userId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data && response.data.products) {
          setLocalCart(response.data.products);
          dispatch(setCart(response.data.products));
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to fetch cart. Please try again.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCart();

    // Update address form when userInfo changes
    if (userInfo?.user.address) {
      setAddressForm({
        street: userInfo.user.address.street || "",
        city: userInfo.user.address.city || "",
        state: userInfo.user.address.state || "",
        zipCode: userInfo.user.address.zipCode || "",
        phone: userInfo.user.phone || "",
      });
    }
  }, [userId, dispatch, userInfo]);

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:3200/product/removefromcart/${userId}/${productId}`,
        {
          withCredentials: true,
        }
      );
      fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  const handleUpdateCartItem = async (productId, quantity) => {
    try {
      await axios.put(
        `http://localhost:3200/product/updatecart/${userId}/${productId}`,
        { quantity },
        {
          withCredentials: true,
        }
      );
      fetchCart();
    } catch (error) {
      console.error("Error updating cart item:", error);
      setError("Failed to update item quantity. Please try again.");
    }
  };
  const handlePaymentSuccess = async (response) => {
    console.log("Payment successful", response);
    setPaymentStatus("success");

    try {
      // Prepare the order data
      const orderData = {
        user: userId,
        orderItems: cart.map((item) => ({
          name: item.name,
          qty: item.quantity,
          price: item.price,
          product: item.productId,
        })),
        shippingAddress: {
          address: userInfo.address.street,
          city: userInfo.user.address.city,
          postalCode: userInfo.address.zipCode,
          country: userInfo.address.state, // Assuming state is used as country
        },
        paymentMethod: "Razorpay",
        totalPrice: total,
        isPaid: true,
        paidAt: new Date(),
      };

      // Make an API call to create the order
      const createOrderResponse = await axios.post(
        "http://localhost:3200/order/create-order",
        orderData,
        { withCredentials: true }
      );

      if (createOrderResponse.data.success) {
        console.log("Order created successfully", createOrderResponse.data);
        // You might want to dispatch an action to update the order in your Redux store
        // or navigate to an order confirmation page
      } else {
        console.error("Failed to create order");
        setError("Failed to create order. Please contact support.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError(
        "An error occurred while creating your order. Please try again."
      );
    }

    // Clear the cart
    setLocalCart([]);
    dispatch(setCart([]));
  };

  const handlePaymentFailure = (error) => {
    console.error("Payment failed", error);
    setPaymentStatus("failure");
  };

  const handleClosePaymentStatus = () => {
    setPaymentStatus(null);
    if (paymentStatus === "success") {
      // Clear the cart or redirect to a thank you page
      setLocalCart([]);
      dispatch(setCart([]));
    }
  };

  const handleOpenAddressDialog = () => {
    if (userInfo?.address) {
      setAddressForm({
        street: userInfo.user.address.street || "",
        city: userInfo.user.address.city || "",
        state: userInfo.user.address.state || "",
        zipCode: userInfo.user.address.zipCode || "",
        phone: userInfo.user.phone || "",
      });
    }
    setOpenAddressDialog(true);
  };

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
    setAddressUpdateStatus(null);
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3200/user/update-address/${userId}`,
        addressForm,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setAddressUpdateStatus("success");
        // Update the Redux store with the new user info
        dispatch(updateUserInfo(response.data.user));
        // Close the dialog after a short delay
        setTimeout(() => {
          handleCloseAddressDialog();
        }, 1500);
      } else {
        setAddressUpdateStatus("error");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setAddressUpdateStatus("error");
    }
  };
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const tax = calculateSubtotal() * 0.1; // Assuming 10% tax
  const shippingFee = 10; // Flat shipping fee
  const discount = 5; // Flat discount
  const total = calculateSubtotal() + tax + shippingFee - discount;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center" sx={{ my: 3 }}>
        Shopping Cart
      </Typography>
      {paymentStatus ? (
        <PaymentStatus
          status={paymentStatus}
          onClose={handleClosePaymentStatus}
        />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.length === 0 ? (
              <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">Your cart is empty</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => Navigate("/products")}
                >
                  Continue Shopping
                </Button>
              </Paper>
            ) : (
              <Paper elevation={3} sx={{ p: 2 }}>
                {cart.map((item) => (
                  <Box key={item.productId}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3} sm={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                          }}
                        />
                      </Grid>
                      <Grid item xs={9} sm={10}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            ${item.totalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid",
                              borderColor: "primary.main",
                              borderRadius: "4px",
                              p: 0.5,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateCartItem(
                                  item.productId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ mx: 2 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateCartItem(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveFromCart(item.productId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))}
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">Delivery Details</Typography>
                <IconButton onClick={handleOpenAddressDialog}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {userInfo?.address ? (
                <>
                  <Typography variant="body1">
                    {userInfo.user.name || "No name provided"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userInfo.user.address.street}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${userInfo.user.address.city}, ${userInfo.address.state} ${userInfo.address.zipCode}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {userInfo.user.phone || "No phone provided"}
                  </Typography>
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    No delivery address provided
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleOpenAddressDialog}
                    sx={{ mt: 1 }}
                  >
                    Add Address
                  </Button>
                </Box>
              )}
            </Paper>

            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">
                    ${calculateSubtotal().toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Tax</Typography>
                  <Typography variant="body1">${tax.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1">
                    ${shippingFee.toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Discount</Typography>
                  <Typography variant="body1" color="error">
                    -${discount.toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${total.toFixed(2)}</Typography>
                </Box>
              </Box>

              <RazorpayPayment
                amount={total}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
            </Paper>
          </Grid>
        </Grid>
      )}

      <Dialog open={openAddressDialog} onClose={handleCloseAddressDialog}>
        <DialogTitle>
          {userInfo?.address ? "Update Address" : "Add Address"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="street"
            label="Street Address"
            type="text"
            fullWidth
            value={addressForm.street}
            onChange={handleAddressChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            value={addressForm.city}
            onChange={handleAddressChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            value={addressForm.state}
            onChange={handleAddressChange}
          />
          <TextField
            margin="dense"
            name="zipCode"
            label="ZIP Code"
            type="text"
            fullWidth
            value={addressForm.zipCode}
            onChange={handleAddressChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone Number"
            type="tel"
            fullWidth
            value={addressForm.phone}
            onChange={handleAddressChange}
          />
          {addressUpdateStatus === "success" && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Address updated successfully!
            </Alert>
          )}
          {addressUpdateStatus === "error" && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to update address. Please try again.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog}>Cancel</Button>
          <Button onClick={handleAddressSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;
