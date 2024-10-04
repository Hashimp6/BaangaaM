const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {  // New field for store
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',  // Assuming you have a Store model
    required: true
  },
  orderItems: [
    {
      name: { type: String },
      qty: { type: Number },
      price: { type: Number },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
    }
  ],
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  paymentMethod: { type: String },
  totalPrice: { type: Number, default: 0.0 },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;