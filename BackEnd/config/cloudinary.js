// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.Cloudinary_name,
  api_key: process.env.cloudinary_API,
  api_secret: process.env.cloudinary_secret
});

module.exports = cloudinary;
