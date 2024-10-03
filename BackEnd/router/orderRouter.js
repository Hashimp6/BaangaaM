const express = require('express');
const { createOrder } = require('../components/orderComponent');
const orderRouter = express.Router();

orderRouter.post('/add_order',createOrder)


module.exports={orderRouter}