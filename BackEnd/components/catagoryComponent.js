const uploadToCloudinary = require("../utils/cloudinaryUtils");
const CategoryModel = require("../models/catagoryModel");

const addCategory = async (req, res) => {
  const { categoryName, categoryImage, categoryType } = req.body;
  
  try {
    const result = await uploadToCloudinary(categoryImage);
    
    if (!result) {
      return res.status(400).json({ success: false, message: "Failed to upload image to Cloudinary" });
    }

    const newCategory = new CategoryModel({
      categoryName,
      categoryImage: result,
      categoryType,
    });

    const savedCategory = await newCategory.save();

    if (savedCategory) {
      return res.status(201).json({ success: true, message: "Category added successfully", category: savedCategory });
    } else {
      return res.status(400).json({ success: false, message: "Failed to add category" });
    }
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ success: false, message: "Error adding category", error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  const { type } = req.body;
  
  try {
    const categories = await CategoryModel.find({ categoryType: type });
    
    if (categories && categories.length > 0) {
      return res.json({ success: true, data: categories });
    } else {
      return res.json({ success: false, message: "No categories found" });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.json({ success: false, message: "Error fetching categories", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.body;
  
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    
    if (deletedCategory) {
      return res.json({ success: true, message: "Category deleted successfully", category: deletedCategory });
    } else {
      return res.json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.json({ success: false, message: "Error deleting category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id, categoryName, categoryImage, categoryType } = req.body;
  
  try {
    let updateData = { categoryName, categoryType };

    if (categoryImage) {
      const result = await uploadToCloudinary(categoryImage);
      if (result) {
        updateData.categoryImage = result;
      } else {
        return res.status(400).json({ success: false, message: "Failed to upload new image to Cloudinary" });
      }
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (updatedCategory) {
      return res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory });
    } else {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ success: false, message: "Error updating category", error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const category = await CategoryModel.findById(id);
    
    if (category) {
      return res.status(200).json({ success: true, data: category });
    } else {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ success: false, message: "Error fetching category", error: error.message });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getCategoryById
};