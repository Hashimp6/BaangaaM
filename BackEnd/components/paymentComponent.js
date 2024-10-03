// Load environment variables
require('dotenv').config();

// Import Razorpay
const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.rzr_id||"rzp_test_1T0MYOKTOuGRH4", // Correct environment variable names
  key_secret: process.env.rzr_secret||"N6W9cOCnEj8aYgmDb4EKasev",
});

// Payment creation function
const paymentCreate = async (req, res) => {
  try {
    const { amount } = req.body;

    // Check if amount is provided
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    // Options for Razorpay order creation
    const options = {
      amount: amount * 100, // Convert to paise (e.g., 100 INR = 10000 paise)
      currency: 'INR',
      receipt: `receipt_${Math.random().toString(36).substring(7)}`, // Generate random receipt ID
    };

    // Create an order using Razorpay instance
    const order = await razorpay.orders.create(options);

    // Send back the order details to frontend
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      message: 'Error creating Razorpay order',
      error: error.message,
    });
  }
};

// Export the function for use in routes
module.exports = { paymentCreate };
