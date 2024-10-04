const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
  try {
    const {
        userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      store  // New field
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const order = new Order({
      user: userId,
      store,  
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();

    return res.status(201).json({
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .populate('store', 'id name');
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('store', 'id name');  // Populate store info

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this user',
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching orders by user',
      error: error.message,
    });
  }
};

// New function to get orders by store ID
const getOrdersByStoreId = async (req, res) => {
  try {
    const orders = await Order.find({ store: req.params.storeId })
      .populate('user', 'id name');

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this store',
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching orders by store',
      error: error.message,
    });
  }
};

module.exports = { createOrder, getAllOrders, getOrdersByUserId, getOrdersByStoreId };