const productModel = require("../models/productModel");
const shopModel = require("../models/shopModel");
const cloudinary = require("../config/cloudinary");
const path = require("path");

const createProduct = async (req, res) => {
  try {
    const {
      email,
      productName,
      catagary,
      brandName,
      describtion,
      originalPrice,
      offerPrice,
      tags,
      image,
    } = req.body;
    console.log(req.body);
    const shop = await shopModel.findOne({ email });
    if (!shop) {
      return res.json({ success: false, message: "Shop not found" });
    }

    let imageURL;
    if (image) {
      try {
        const uploadedImageUrl = await cloudinary.uploader.upload(image); // No folder specified
        imageURL = uploadedImageUrl.secure_url;
        console.log("image uploaded to cloudinary"); // Store the secure URL
      } catch (err) {
        console.error("Error uploading logo:", err); // Handle the error
      }
    }

    const newProduct = new productModel({
      product_name: productName,
      description: describtion,
      brandName: brandName,
      category: catagary,
      originalPrice: originalPrice,
      offerPrice: offerPrice,
      tags: tags,
      image: imageURL,
    });
    const productSaved = await newProduct.save();
    if (productSaved) {
      shop.products.push(productSaved._id);
      await shop.save();
      return res.json({ success: true, message: "product added" });
    } else {
      return res.json({ success: false, message: "product cant added" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "product cant added" });
  }
};

const findAllProducts = async (req, res) => {
  try {
    const email = req.params.email;
    const shop = await shopModel.findOne({ email }).populate("products");
    let response = shop ? shop.products : [];
    return res.json({ success: true, data: response });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "failed to find products" });
  }
};

const allProduct = async (req, res) => {
  try {
    const allProduct = await productModel.find();
    if (allProduct) {
      console.log(allProduct);
      return res.json({ success: true, data: allProduct });
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};
const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await productModel.findByIdAndDelete(productId);
    if (result) {
      return res.json({
        success: true,
        message: "product deleted successfully",
      });
    } else {
      return res.json({ success: false, message: "product not found" });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};

module.exports = { createProduct, findAllProducts, allProduct, deleteProduct };
