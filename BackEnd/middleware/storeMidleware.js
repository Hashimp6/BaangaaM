const jwt = require('jsonwebtoken');

const authenticateStore = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No store token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.store = decoded;
    next();
  } catch (error) {
    console.error("Store JWT verification failed:", error);
    return res.status(403).json({ success: false, message: "Invalid store token" });
  }
};

module.exports = authenticateStore;