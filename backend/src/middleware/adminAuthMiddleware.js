const jwt = require('jsonwebtoken');
const env = require('../config/env');

const adminAuthMiddleware = (req, res, next) => {
  let token = null;

  // Check httpOnly cookie first
  if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  } 
  // Fallback to Authorization: Bearer <token>
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No admin authentication token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, env.ADMIN_JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Admin privileges required.'
      });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired admin session. Please log in again.'
    });
  }
};

module.exports = adminAuthMiddleware;
