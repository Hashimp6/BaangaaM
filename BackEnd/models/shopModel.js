const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    email: { type: String },
    name:{type:String}, 
    password:{type:String},
    shopName: { type: String  },             
    location: { type: String  },   
    address: { type: String }, 
    category: { type: String },       
    logo: { type: String },            
    banner: { type: String},            
    isFavorite: { type: Boolean },   
    features:{type:[String]},      
    contact: {           
        phone: { type: String }, 
        whatsapp: { type: String }, 
        instagram:{type:String},                            // Optional phone number
    },
    createdAt: { type: Date, default: Date.now },           // Timestamp of when the shop was created
});

const shopModel = mongoose.model('Shop', shopSchema);

module.exports = shopModel;
