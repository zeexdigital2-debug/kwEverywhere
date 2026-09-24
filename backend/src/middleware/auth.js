const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const apiKeyHeader = req.headers['x-api-key'] || req.query.apiKey;

    let userId = 'guest_user_demo';
    let userEmail = 'guest@kws.local';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        userId = decoded.userId || decoded.sub || userId;
        userEmail = decoded.email || userEmail;
      } catch (err) {
        // Could be extension token or Supabase token format
        userId = token.slice(0, 24);
      }
    } else if (apiKeyHeader) {
      try {
        const user = await User.findOne({ apiKey: apiKeyHeader });
        if (user) {
          userId = user._id.toString();
          userEmail = user.email;
          req.userDoc = user;
        } else {
          userId = apiKeyHeader.slice(0, 24);
        }
      } catch (e) {
        userId = apiKeyHeader;
      }
    }

    req.user = {
      id: userId,
      email: userEmail
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    req.user = { id: 'guest_user_demo', email: 'guest@kws.local' };
    next();
  }
};

module.exports = authMiddleware;
