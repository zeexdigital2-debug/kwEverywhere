const jwt = require('jsonwebtoken');
const env = require('../config/env');

// In-memory credit store (fallback when no DB)
const creditStore = new Map();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];

  // Guest mode — always allow with default identity
  req.user = { id: 'guest', email: 'guest@kws.local', isGuest: true };

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = { id: decoded.sub || decoded.userId || 'user', email: decoded.email || '', isGuest: false };
    } catch (e) {
      // Try as opaque token id
      req.user = { id: token.slice(0, 24), email: '', isGuest: false };
    }
  }

  // Initialize credits for new users
  if (!creditStore.has(req.user.id)) {
    creditStore.set(req.user.id, 250);
  }
  req.credits = creditStore.get(req.user.id);
  req.creditStore = creditStore;

  next();
};

module.exports = authMiddleware;
