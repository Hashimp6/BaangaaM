const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No user token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("User JWT verification failed:", error);
    return res.status(403).json({ success: false, message: "Invalid user token" });
  }
};

module.exports = authenticateUser;