const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, 
    googleId: { type: String, unique: true, sparse: true }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
