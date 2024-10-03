const productModel = require("../models/productModel");
const shopModel = require("../models/shopModel");

const addToFavorite = async (req, res) => {
  const { productId } = req.body;

  try {
    // Find product by ID and set isFavorite to true
    const response = await productModel.findByIdAndUpdate(
      productId,
      { isFavorite: true },
      { new: true } // Returns the updated document
    );

    if (response) {
      res
       
        .json({ success:true,message: "Product added to favorites", product: response });
    } else {
      res.json({success:false, message: "Product not found" });
    }
  } catch (error) {
    res.json({ message: "Error adding to favorites", error });
    console.log(error);
  }
};

const removeFromFavorite = async (req, res) => {
  const { productId } = req.body;

  try {
    // Find product by ID and set isFavorite to false
    const response = await productModel.findByIdAndUpdate(
      productId,
      { isFavorite: false },
      { new: true } // Returns the updated document
    );

    if (response) {
      res
        .json({ success:true, message: "Product removed from favorites", product: response });
    } else {
      res.json({ success:false, message: "Product not found" });
    }
  } catch (error) {
    res.json({ success:false, message: "Error removing from favorites", error });
    console.log(error);
  }
};

const addShopToFavorite = async (req, res) => {
  const {storeId } = req.body;
  console.log("rwflaaa");


  try {
    // Find product by ID and set isFavorite to true
    const response = await shopModel.findByIdAndUpdate(
      storeId,
      { isFavorite: true },// Returns the updated document
    );

    if (response) {
      console.log("added");
      res.json({ success:true, message: "Shop added to favorites", product: response });
    } else {
        
      console.log("addednopp");
      res.json({ success:false, message: "Shop not found" });
    }
  } catch (error) {
    res.json({ success:false, message: "Error adding to favorites", error });
    console.log(error);
  }
};

const removeShopFromFavorite = async (req, res) => {
  const { storeId } = req.body;

  console.log("removedlaaa");
  try {
    // Find product by ID and set isFavorite to false
    const response = await shopModel.findByIdAndUpdate(
      storeId,
      { isFavorite: false },
    );

    if (response) {
      console.log("removed");
      res.json({ success:true, message: "Shop removed from favorites", product: response });
    } else {
      res.json({ success:false, message: "Shop not found" });
    }
  } catch (error) {
    res.json({ success:false, message: "Error removing from favorites", error });
    console.log(error);
  }
};

module.exports = {
  addToFavorite,
  removeFromFavorite,
  addShopToFavorite,
  removeShopFromFavorite,
};
