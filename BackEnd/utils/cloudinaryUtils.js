const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
};

module.exports = uploadToCloudinary;
