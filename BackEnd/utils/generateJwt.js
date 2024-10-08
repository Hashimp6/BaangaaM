const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "your_jwt_secret_key";

// Generate a token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secretKey, {
    expiresIn: "7d",
  });
};

// Verify a token
const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { generateToken, verifyToken };
