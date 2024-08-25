const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

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
      return res.json({ message: " email already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({ message: "New user created successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.json({ message: "couldnt create a user" });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const findUser = await userModel.findOne({ email: email });
      if (findUser) {
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (isMatch) {
          const token = generateToken(findUser);
          return res.status(200).json({ success: true, message: "Login successful", user: findUser,token:token });
        } else {
          return res.status(400).json({ success: false, message: "Incorrect password" });
        }
      } else {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = { registerUser, loginUser };
