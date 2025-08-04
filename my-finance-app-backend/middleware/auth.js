const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the client from DB to ensure they exist and are active
    const client = await prisma.client.findUnique({ where: { id: decoded.id } });
    if (!client) {
      return res.status(401).json({ message: 'Client no longer exists or invalid token.' });
    }

    req.user = {
      id: client.id,
      role: client.role,
      email: client.email,
      name: client.name,
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(403).json({ message: 'Token is not valid.' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  }
  next();
};

module.exports = { auth, authorize };