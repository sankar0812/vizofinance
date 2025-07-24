const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  // Extract "Bearer " prefix if present
  const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  // Verify token
  try {
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.user = decoded.id; // Attach user ID to request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token is not valid.' });
  }
};

module.exports = auth;
