const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateJwt");
const { resendOtp } = require("./authComponent");
const { find } = require("../models/catagoryModel");

const salt = 10;

// Function to hash the password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, salt);
};

// Function to register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.json({ success: false, message: " email already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      googleId: email || undefined,
    });
    await newUser.save();

    return res
      .json({ success: true, message: "New user created successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.json({ success: false, message: "couldnt create a user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: "Email and password are required" });
    }

    const findUser = await userModel.findOne({ email: email });
    if (findUser) {
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (isMatch) {
        const token = generateToken(findUser);
        console.log("token is",token);
       
        return res.cookie('token', token, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        }).json({
          success: true,
          message: "Login successful",
          user:findUser,
            role:"user"
        });
      } else {
        return res.json({ success: false, message: "Incorrect password" });
      }
    } else {
      return resendOtp.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.json({ message: "Internal server error" });
  }
};

const updateAddress= async (req, res) => {
  const { street, city, state, zipCode, phone } = req.body;

  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          'address.street': street,
          'address.city': city,
          'address.state': state,
          'address.zipCode': zipCode,
          'phone': phone // Update phone number at the user level
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, message: 'Address updated successfully', user });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }}

const allUsers = async (req, res) => {
  try {
    const result = await userModel.find();
    if (result && result.length > 0) {
      return res.json({ success: true, data: result });
    } else {
      return res.json({ success: false, message: "No users found" });
    }
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.json({ success: false, message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  console.log("is in delete back");
  try {
    const { id } = req.params; 
    const result = await userModel.findByIdAndDelete(id);
    if (result) {
      return res.json({ success: true, message: "User deleted successfully" });
    } else {
      return res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Internal server error" });
  }
};

module.exports = { registerUser,updateAddress, loginUser, allUsers, deleteUser };
