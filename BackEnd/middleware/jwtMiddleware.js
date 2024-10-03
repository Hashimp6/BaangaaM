const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  // Determine which token to look for based on the route
  let tokenName;
  if (req.path.startsWith('/user')) {
    tokenName = 'user_token';
  } else if (req.path.startsWith('/store')) {
    tokenName = 'store_token';
  } else if (req.path.startsWith('/admin')) {
    tokenName = 'admin_token';
  } else {
    return res.json({ success: false, message: "Access denied" });
  }

  const token = req.cookies[tokenName];

  if (!token) {
    return res.json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.json({ success: false, message: "Invalid token" });
  }
};

module.exports = authenticateJWT;