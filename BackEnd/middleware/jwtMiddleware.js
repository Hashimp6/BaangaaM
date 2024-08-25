const { verifyToken } = require('../utils/generateJwt'); 

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; 

  if (!token) {
    return res.sendStatus(403);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(403); 
  }
};

module.exports = authenticateJWT;
