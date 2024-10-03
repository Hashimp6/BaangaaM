const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
});

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  address: {
    type: addressSchema,
    required: true
  },
  phone: { type: String } // Add phone field at the user level
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;