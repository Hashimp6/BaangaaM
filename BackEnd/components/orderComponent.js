const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;
  
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        isPaid: true,
        paidAt: Date.now(),
      });
  
      const createdOrder = await order.save();
  
      res.status(201).json({
        success: true,
        order: createdOrder
      });
    }
  };
  const allOrders= async(req,res)=>{
    const result=Order.find()
    if(result)
    {
        return res.json({success:true,data:result})
    }
  }
  module.exports={createOrder}
  