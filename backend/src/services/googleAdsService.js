const axios = require('axios');
const env = require('../config/env');

// In-memory 24-hour cache: key -> { data, expiresAt }
const keywordCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// OAuth access token state
let cachedAccessToken = null;
let accessTokenExpiresAt = 0;

/**
 * Obtain a fresh Google OAuth2 access token using the refresh token.
 * Tokens are cached in-memory until ~1 minute before expiration.
 */
async function getAccessToken() {
  const now = Date.now();
  if (cachedAccessToken && now < accessTokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  const clientId = env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = env.GOOGLE_ADS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Ads OAuth credentials missing in environment.');
  }

  try {
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    );

    const data = response.data;
    if (!data.access_token) {
      throw new Error('Failed to retrieve access token from Google OAuth endpoint.');
    }

    cachedAccessToken = data.access_token;
    const expiresIn = Number(data.expires_in) || 3600;
    accessTokenExpiresAt = now + expiresIn * 1000;

    return cachedAccessToken;
  } catch (err) {
    // Sanitize error: never log or expose client secret or tokens
    const errMsg = err.response?.data?.error_description || err.response?.data?.error || err.message;
    console.error('[GoogleAdsService] OAuth token refresh failed:', errMsg);
    throw new Error(`Google OAuth error: ${errMsg}`);
  }
}

/**
 * Generate keyword ideas from Google Ads API v24 for a given keyword.
 * Results are cached for 24 hours.
 *
 * @param {string} keyword
 * @returns {Promise<Array>} List of keyword ideas with volume, competition, cpc, and 12-month trend
 */
async function generateKeywordIdeas(keyword) {
  if (!keyword || typeof keyword !== 'string') {
    throw new Error('A valid keyword string is required.');
  }

  const cleanKw = keyword.trim();
  const cacheKey = cleanKw.toLowerCase();
  const now = Date.now();

  // 1. Check 24-hour cache
  const cached = keywordCache.get(cacheKey);
  if (cached && now < cached.expiresAt) {
    return cached.data;
  }

  // 2. Obtain valid Access Token
  const accessToken = await getAccessToken();

  // 3. Prepare Customer ID & Endpoint
  const customerId = (env.GOOGLE_ADS_CUSTOMER_ID || '7500158188').replace(/[^0-9]/g, '');
  if (!customerId) {
    throw new Error('Google Ads Customer ID is missing or invalid.');
  }

  const endpoint = `https://googleads.googleapis.com/v24/customers/${customerId}:generateKeywordIdeas`;

  const requestBody = {
    keywordSeed: {
      keywords: [cleanKw]
    },
    geoTargetConstants: ['geoTargetConstants/2840'], // United States (default)
    language: 'languageConstants/1000', // English
    keywordPlanNetwork: 'GOOGLE_SEARCH'
  };

  try {
    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        // developer-token header intentionally omitted as specified
      },
      timeout: 15000
    });

    const rawResults = response.data?.results || [];

    // 4. Format response: text, avgMonthlySearches, competition, CPC, monthlySearchVolumes
    const formatted = rawResults.map((item) => {
      const text = item.text || cleanKw;
      const metrics = item.keywordIdeaMetrics || {};

      // Average monthly searches
      const avgMonthlySearches = metrics.avgMonthlySearches ? Number(metrics.avgMonthlySearches) : 0;

      // Competition enum (LOW, MEDIUM, HIGH, etc.)
      const competition = metrics.competition || 'UNSPECIFIED';

      // CPC in USD: (bid micros / 1,000,000)
      const lowBidMicros = metrics.lowTopOfPageBidMicros ? Number(metrics.lowTopOfPageBidMicros) : 0;
      const highBidMicros = metrics.highTopOfPageBidMicros ? Number(metrics.highTopOfPageBidMicros) : 0;
      
      const lowCpc = lowBidMicros > 0 ? Number((lowBidMicros / 1000000).toFixed(2)) : 0;
      const highCpc = highBidMicros > 0 ? Number((highBidMicros / 1000000).toFixed(2)) : 0;
      const cpc = highCpc > 0 ? highCpc : lowCpc;

      // Monthly Search Volumes (12 months trend)
      const monthlySearchVolumes = (metrics.monthlySearchVolumes || []).map((m) => ({
        year: Number(m.year),
        month: m.month,
        monthlySearches: Number(m.monthlySearches || 0)
      }));

      return {
        text,
        avgMonthlySearches,
        competition,
        cpc,
        cpcRange: {
          low: lowCpc,
          high: highCpc
        },
        monthlySearchVolumes
      };
    });

    // 5. Cache result for 24 hours
    keywordCache.set(cacheKey, {
      data: formatted,
      expiresAt: now + CACHE_TTL_MS
    });

    return formatted;
  } catch (err) {
    // Sanitize error: never log full request headers or secrets
    const status = err.response?.status;
    const apiError = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    console.error(`[GoogleAdsService] API call failed (${status || 'network'}):`, apiError);
    throw new Error(`Google Ads API error: ${apiError}`);
  }
}

module.exports = {
  getAccessToken,
  generateKeywordIdeas
};
