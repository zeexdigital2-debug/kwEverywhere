const store = require('../services/store');

// Per-IP: 10 searches per minute, 30,000 keywords per day
const DAILY_KEYWORD_LIMIT_PER_IP = 30000;
const MINUTE_LIMIT_PER_IP = 10;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
}

function getUtcDateStr() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function safetyLimiter(options = {}) {
  return async (req, res, next) => {
    try {
      const ip = getClientIp(req);
      const minuteBucket = Math.floor(Date.now() / 60000);
      const dateStr = getUtcDateStr();

      const minKey = `rl:web:${ip}:m:${minuteBucket}`;
      const dayKey = `rl:web:${ip}:d:${dateStr}`;

      // 1. Minute rate limit: 10 searches per minute per IP
      const minuteCount = await store.incr(minKey, 90, 1);
      if (minuteCount > MINUTE_LIMIT_PER_IP) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests. Limit is 10 searches per minute. Please try again shortly.'
        });
      }

      // 2. Daily keywords limit: 30,000 keywords per day per IP
      let kwCount = 1;
      if (options.isResearch) {
        const rawKeywords = req.body?.keywords;
        const list = Array.isArray(rawKeywords)
          ? rawKeywords
          : (typeof rawKeywords === 'string' ? rawKeywords.split(/[\n,]+/) : []);
        kwCount = Math.max(1, list.filter(k => String(k || '').trim().length > 0).length);
      }

      const currentDailyKeywords = Number(await store.get(dayKey)) || 0;
      if (currentDailyKeywords + kwCount > DAILY_KEYWORD_LIMIT_PER_IP) {
        return res.status(429).json({
          success: false,
          error: 'Daily limit reached: Maximum 30,000 keywords per day. Please try again tomorrow.'
        });
      }

      await store.incr(dayKey, 172800, kwCount);

      next();
    } catch (err) {
      console.error('[SafetyLimiter] Error:', err.message);
      next();
    }
  };
}

module.exports = { safetyLimiter, getClientIp, DAILY_KEYWORD_LIMIT_PER_IP };
