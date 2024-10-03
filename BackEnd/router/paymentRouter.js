const express = require('express');
const Razorpay = require('razorpay');
const { paymentCreate } = require('../components/paymentComponent');
const paymentRouter = express.Router();

// Initialize Razorpay


paymentRouter.post('/create-order', paymentCreate)

module.exports = paymentRouter;