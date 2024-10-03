const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },               // Name of the product
    image: { type: String, required: true },              // URL or path to the product image
    quantity: { type: Number, required: true },           // Available quantity of the product
    originalPrice: { type: Number, required: true },      // Original price of the product
    offerPrice: { type: Number },                         // Discounted price, if any
    description: { type: String },                        // Optional description of the product
    category: { type: String },                           // Category to which the product belongs
    createdAt: { type: Date, default: Date.now },         // Timestamp of when the product was created
    updatedAt: { type: Date, default: Date.now },         // Timestamp of when the product was last updated
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
