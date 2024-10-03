const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },             // Name of the product
    image: { type: String, },              // URL or path to the product image
    quantity: { type: Number,  },
    tags:[{type:String}],  
    brandName:{type:String},         // Available quantity of the product
    originalPrice: { type: Number},      // Original price of the product
    offerPrice: { type: Number, },                         // Discounted price, if any
    description: { type: String },   
    rates: { type: String },  
    isFavorite: { type: Boolean, default: false },                   // Optional description of the product
    category: { type: String },                           // Category to which the product belongs
    createdAt: { type: Date, default: Date.now },         // Timestamp of when the product was created
    updatedAt: { type: Date, default: Date.now },         // Timestamp of when the product was last updated
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
