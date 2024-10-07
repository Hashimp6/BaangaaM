import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';


const RazorpayPayment = ({ amount, onSuccess, onFailure }) => {
  const handlePayment = async () => {
    try {
      // Create Razorpay order
      const orderResponse = await axios.post(`${import.meta.env.VITE_Backend_api}/payment/create-order`, { amount });
      const { id: orderId } = orderResponse.data;
      console.log("order cre",orderResponse.data);

      const options = {
        key:"rzp_test_1T0MYOKTOuGRH4", // Your Razorpay Key ID
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'P6#m',
        description: 'Purchase Description',
        order_id: orderId,
        handler: function (response) {
          onSuccess(response);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Customer Address'
        },
        theme: {
          color: '#F37254'
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      onFailure(error);
    }
  };

  return (
    <Button onClick={handlePayment}
    variant="contained"
    fullWidth
    sx={{ mt: 2 }}
  >
    Proceed to Payment
  </Button>
  );
};
export default RazorpayPayment;