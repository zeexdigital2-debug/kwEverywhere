const { fetchGoogleSuggestions } = require('../services/googleAutocomplete');
const { getKeywordMetrics } = require('../services/trendService');
const KeywordHistory = require('../models/KeywordHistory');
const User = require('../models/User');
const CreditLog = require('../models/CreditLog');

// In-memory credit tracker fallback if MongoDB is disconnected
const memoryCredits = new Map();

exports.researchKeywords = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let inputKeywords = req.body.keywords || req.body.keyword;

    if (!inputKeywords) {
      return res.status(400).json({ status: 'error', message: 'Please provide a "keywords" array or "keyword" string.' });
    }

    if (!Array.isArray(inputKeywords)) {
      inputKeywords = [inputKeywords];
    }

    // Clean & filter empty input
    const cleanList = inputKeywords
      .map(k => typeof k === 'string' ? k.trim() : '')
      .filter(k => k.length > 0)
      .slice(0, 50); // limit max 50 keywords per request

    if (cleanList.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No valid non-empty keywords provided.' });
    }

    const creditsNeeded = cleanList.length;

    // Check credits balance
    let currentCredits = 250;
    try {
      const user = await User.findById(userId);
      if (user) {
        if (user.credits < creditsNeeded) {
          return res.status(402).json({
            status: 'error',
            message: `Insufficient credits. You need ${creditsNeeded} credits, but have ${user.credits}.`
          });
        }
        user.credits -= creditsNeeded;
        await user.save();
        currentCredits = user.credits;
      } else {
        // Memory fallback
        const existing = memoryCredits.get(userId) ?? 250;
        if (existing < creditsNeeded) {
          return res.status(402).json({
            status: 'error',
            message: `Insufficient credits. You need ${creditsNeeded} credits, but have ${existing}.`
          });
        }
        currentCredits = existing - creditsNeeded;
        memoryCredits.set(userId, currentCredits);
      }
    } catch (e) {
      const existing = memoryCredits.get(userId) ?? 250;
      currentCredits = Math.max(0, existing - creditsNeeded);
      memoryCredits.set(userId, currentCredits);
    }

    // Perform research for each keyword asynchronously
    const results = await Promise.all(
      cleanList.map(async (keyword) => {
        const metrics = getKeywordMetrics(keyword);
        const suggestions = await fetchGoogleSuggestions(keyword);

        // Determine Trend Direction (📈 Upward / ➡️ Stable / 📉 Downward)
        let trendDirection = '➡️ Stable';
        if (Array.isArray(metrics.trend) && metrics.trend.length >= 2) {
          const firstHalf = metrics.trend.slice(0, 6).reduce((a, b) => a + b, 0) / 6;
          const secondHalf = metrics.trend.slice(6).reduce((a, b) => a + b, 0) / 6;
          if (secondHalf - firstHalf > 8) trendDirection = '📈 Upward';
          else if (firstHalf - secondHalf > 8) trendDirection = '📉 Downward';
        }

        const resultObj = {
          keyword,
          searchVolume: metrics.searchVolume,
          trendDirection,
          competition: metrics.competition,
          competitionScore: metrics.competitionScore,
          difficulty: metrics.difficulty,
          cpc: metrics.cpc,
          trend: metrics.trend,
          suggestions,
          searchedAt: new Date()
        };

        // Try saving to DB asynchronously
        try {
          await KeywordHistory.create({
            userId,
            ...resultObj
          });
        } catch (dbErr) {
          // ignore DB error in fallback mode
        }

        return resultObj;
      })
    );

    // Audit log
    try {
      await CreditLog.create({
        userId,
        amount: -creditsNeeded,
        action: 'KEYWORD_RESEARCH',
        description: `Researched ${creditsNeeded} keywords (${cleanList.slice(0, 3).join(', ')}...)`
      });
    } catch (e) {}

    res.json({
      status: 'success',
      count: results.length,
      remainingCredits: currentCredits,
      data: results
    });

  } catch (error) {
    next(error);
  }
};
