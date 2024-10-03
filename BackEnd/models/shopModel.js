const mongoose = require("mongoose");
const productModel = require("./productModel");

const shopSchema = new mongoose.Schema({
  email: { type: String },
  name: { type: String },
  password: { type: String },
  shopName: { type: String },
  location: { type: String },
  Geolocation: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  address: { type: String },
  category: { type: String },
  logo: { type: String },
  banner: { type: String },
  isFavorite: { type: Boolean },
  features: { type: [String] },
  isFavorite: { type: Boolean, default: false },
  contact: {
    phone: { type: String },
    whatsapp: { type: String },
    instagram: { type: String },
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

shopSchema.index({ Geolocation: "2dsphere" });

const shopModel = mongoose.model("Shop", shopSchema);

module.exports = shopModel;