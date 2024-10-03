const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');

const authenticateAdmin = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ success: false, message: "No admin token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await adminModel.findOne({ email: decoded.email });

    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin JWT verification failed:", error);
    return res.json({ success: false, message: "Invalid admin token" });
  }
};

module.exports = authenticateAdmin;
