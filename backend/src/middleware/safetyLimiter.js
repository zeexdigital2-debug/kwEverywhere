// In-memory rate & quota tracker for IP and safety limits
// Per-IP: 10 searches per minute, 20,000 keywords per day

const ipMinuteRequests = new Map();
const ipDailyKeywords = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
}

function safetyLimiter(options = {}) {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const now = Date.now();

    // 1. Minute rate limit: 10 searches per minute per IP
    let minuteRecord = ipMinuteRequests.get(ip);
    if (!minuteRecord || now > minuteRecord.resetAt) {
      minuteRecord = { count: 0, resetAt: now + 60 * 1000 };
      ipMinuteRequests.set(ip, minuteRecord);
    }

    if (minuteRecord.count >= 10) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Limit is 10 searches per minute. Please try again shortly.'
      });
    }

    // 2. Daily keywords limit: 20,000 keywords per day per IP
    let dailyRecord = ipDailyKeywords.get(ip);
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    if (!dailyRecord || now > dailyRecord.resetAt) {
      dailyRecord = { count: 0, resetAt: now + ONE_DAY_MS };
      ipDailyKeywords.set(ip, dailyRecord);
    }

    // Determine keyword count for this request
    let kwCount = 1;
    if (options.isResearch) {
      const rawKeywords = req.body?.keywords;
      const list = Array.isArray(rawKeywords)
        ? rawKeywords
        : (typeof rawKeywords === 'string' ? rawKeywords.split(/[\n,]+/) : []);
      kwCount = Math.max(1, list.filter(k => String(k || '').trim().length > 0).length);
    }

    if (dailyRecord.count + kwCount > 20000) {
      return res.status(429).json({
        success: false,
        error: 'Daily limit reached: Maximum 20,000 keywords per day. Please try again tomorrow.'
      });
    }

    // Increment usage
    minuteRecord.count += 1;
    dailyRecord.count += kwCount;

    next();
  };
}

// Clean up expired records every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of ipMinuteRequests.entries()) {
    if (now > rec.resetAt) ipMinuteRequests.delete(ip);
  }
  for (const [ip, rec] of ipDailyKeywords.entries()) {
    if (now > rec.resetAt) ipDailyKeywords.delete(ip);
  }
}, 10 * 60 * 1000).unref();

module.exports = { safetyLimiter, getClientIp };
