const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateJwt");
const adminModel = require("../models/adminModel");

const salt = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, salt);
};

const registerAdmin = async (req, res) => {
    try {
      const {   email, password } = req.body;
  
      // Check if the user already exists
      const existingAdmin = await adminModel.findOne({ email: email });
  
      if (existingAdmin) {
        return res.json({
          success: false,
          message: " email already registered for another admin",
        });
      }
      const hashedPassword = await hashPassword(password);
      const newAdmin = new adminModel({
        email: email,
        password: hashedPassword,
      });
      await newAdmin.save();
  
      return res
        .status(201)
        .json({ success: true, message: "New shop created successfully" });
    } catch (error) {
      console.error("Error registering store:", error);
      return res.json({ success: false, message: "couldnt create a store" });
    }
  };
  
  const loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
  
      const findAdmin = await adminModel.findOne({ email: email });
      if (findAdmin) {
        const isMatch = await bcrypt.compare(password, findAdmin.password);
        if (isMatch) {
          const token = generateToken(findAdmin);
          console.log("token is",token);
          return     res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
             maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          }).json({
            success: true,
            message: "Admin Login successfull",
            admin: findAdmin,
            role:"admin",
            token: token,
          });
        } else {
          return res.json({ success: false, message: "Incorrect password" });
        }
      } else {
        return res.json({ success: false, message: "Admin is not found" });
      }
    } catch (error) {
      console.error("Error logging in Admin:", error);
      return res.json({ message: "Internal server error" });
    }

  };
  module.exports = { registerAdmin,loginAdmin};