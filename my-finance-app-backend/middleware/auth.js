const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

/**
 * Middleware to authenticate user via JWT.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Invalid token payload.' });
    }

    const { id, role } = decoded;
    let user;

    switch (role) {
      case 'ADMIN':
        user = await prisma.admin?.findUnique({ where: { id } });
        break;
      case 'EMPLOYEE':
        user = await prisma.employee?.findUnique({ where: { id } });
        break;
      case 'USER':
        user = await prisma.client?.findUnique({ where: { id } });
        break;
      default:
        return res.status(401).json({ message: 'Unrecognized role in token.' });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found or account may have been deleted.' });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

/**
 * Middleware to restrict access by role.
 * @param  {...string} roles - Allowed roles (e.g., 'ADMIN', 'EMPLOYEE')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { auth, authorize };