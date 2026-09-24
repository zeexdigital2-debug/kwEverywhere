/**
 * Middleware to check and deduct credits for a tool request
 */
const creditMiddleware = (cost = 1) => {
  return (req, res, next) => {
    if (req.credits < cost) {
      return res.status(403).json({ 
        error: 'Insufficient credits',
        message: `This tool requires ${cost} credit(s). You have ${req.credits} remaining.`
      });
    }
    
    // Deduct credits
    req.credits -= cost;
    req.creditStore.set(req.user.id, req.credits);
    
    // Pass the deducted amount for response headers if needed
    req.creditsUsed = cost;
    
    next();
  };
};

module.exports = creditMiddleware;
