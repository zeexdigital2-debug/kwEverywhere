const { Redis } = require('@upstash/redis');
const env = require('../config/env');

// Resolve Redis credentials from environment
const redisUrl = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let redisClient = null;
let storeType = 'memory';

if (redisUrl && redisToken) {
  try {
    redisClient = new Redis({
      url: redisUrl.trim(),
      token: redisToken.trim()
    });
    storeType = 'redis';
  } catch (err) {
    console.warn('[Store] Failed to initialize Upstash Redis, falling back to memory store:', err.message);
    redisClient = null;
    storeType = 'memory';
  }
}

// In-Memory Fallback Map: key -> { value, expiresAt }
const memoryStore = new Map();

// Periodic sweep to prevent memory leaks in fallback mode
const MEMORY_SWEEP_INTERVAL_MS = 5 * 60 * 1000;
const sweepTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, item] of memoryStore.entries()) {
    if (item && item.expiresAt && now > item.expiresAt) {
      memoryStore.delete(key);
    }
  }
}, MEMORY_SWEEP_INTERVAL_MS);
if (sweepTimer.unref) sweepTimer.unref();

function safeParse(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return val;
      }
    }
  }
  return val;
}

// Memory implementations
function memGet(key) {
  const now = Date.now();
  const item = memoryStore.get(key);
  if (!item) return null;
  if (item.expiresAt && now > item.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return item.value;
}

function memMget(keys) {
  return keys.map(k => memGet(k));
}

function memSet(key, value, ttlSeconds) {
  const now = Date.now();
  memoryStore.set(key, {
    value,
    expiresAt: ttlSeconds && ttlSeconds > 0 ? now + (ttlSeconds * 1000) : null
  });
  return true;
}

function memIncr(key, ttlSeconds, amount = 1) {
  const now = Date.now();
  const existing = memoryStore.get(key);
  if (!existing || (existing.expiresAt && now > existing.expiresAt)) {
    const newVal = amount;
    memoryStore.set(key, {
      value: newVal,
      expiresAt: ttlSeconds && ttlSeconds > 0 ? now + (ttlSeconds * 1000) : null
    });
    return newVal;
  }
  const newVal = (Number(existing.value) || 0) + amount;
  existing.value = newVal;
  // pehli baar EXPIRE lagao -> do not change expiresAt on subsequent increments
  return newVal;
}

/**
 * mget(keys): Retrieve multiple keys
 */
async function mget(keys) {
  if (!Array.isArray(keys) || keys.length === 0) return [];
  if (!redisClient) {
    return memMget(keys);
  }

  try {
    const CHUNK_SIZE = 500;
    const results = [];
    for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
      const chunk = keys.slice(i, i + CHUNK_SIZE);
      const chunkResults = await redisClient.mget(...chunk);
      if (Array.isArray(chunkResults)) {
        results.push(...chunkResults.map(safeParse));
      } else {
        results.push(...chunk.map(() => null));
      }
    }
    return results;
  } catch (err) {
    console.error('[Store] Redis mget error, falling back to memory:', err.message);
    return memMget(keys);
  }
}

/**
 * get(key): Retrieve single key
 */
async function get(key) {
  if (!key) return null;
  const [val] = await mget([key]);
  return val !== undefined ? val : null;
}

/**
 * set(key, value, ttlSeconds): Store a key with optional TTL in seconds
 */
async function set(key, value, ttlSeconds) {
  if (!key) return false;
  if (!redisClient) {
    return memSet(key, value, ttlSeconds);
  }

  try {
    if (ttlSeconds && ttlSeconds > 0) {
      await redisClient.set(key, value, { ex: ttlSeconds });
    } else {
      await redisClient.set(key, value);
    }
    return true;
  } catch (err) {
    console.error('[Store] Redis set error, falling back to memory:', err.message);
    return memSet(key, value, ttlSeconds);
  }
}

/**
 * mset(entries, ttlSeconds): Store multiple key-value pairs in a single pipeline round trip
 * @param {Array<{ key: string, value: any }>} entries
 * @param {number} ttlSeconds
 */
async function mset(entries, ttlSeconds) {
  if (!Array.isArray(entries) || entries.length === 0) return true;
  if (!redisClient) {
    for (const item of entries) {
      if (item && item.key) memSet(item.key, item.value, ttlSeconds);
    }
    return true;
  }

  try {
    const pipeline = redisClient.pipeline();
    for (const item of entries) {
      if (item && item.key) {
        if (ttlSeconds && ttlSeconds > 0) {
          pipeline.set(item.key, item.value, { ex: ttlSeconds });
        } else {
          pipeline.set(item.key, item.value);
        }
      }
    }
    await pipeline.exec();
    return true;
  } catch (err) {
    console.error('[Store] Redis pipeline mset error, falling back to memory:', err.message);
    for (const item of entries) {
      if (item && item.key) memSet(item.key, item.value, ttlSeconds);
    }
    return true;
  }
}

/**
 * incr(key, ttlSeconds, amount = 1): Atomic increment with TTL set on creation
 */
async function incr(key, ttlSeconds, amount = 1) {
  if (!key) return 0;
  if (!redisClient) {
    return memIncr(key, ttlSeconds, amount);
  }

  try {
    const p = redisClient.pipeline();
    if (amount === 1) {
      p.incr(key);
    } else {
      p.incrby(key, amount);
    }
    if (ttlSeconds && ttlSeconds > 0) {
      p.expire(key, ttlSeconds, 'nx');
    }
    const results = await p.exec();
    const val = Array.isArray(results) ? results[0] : results;
    return Number(val) || 0;
  } catch (err) {
    console.error('[Store] Redis incr error, falling back to memory:', err.message);
    return memIncr(key, ttlSeconds, amount);
  }
}

/**
 * getStoreType(): Returns 'redis' or 'memory'
 */
function getStoreType() {
  return storeType;
}

module.exports = {
  getStoreType,
  get,
  mget,
  set,
  mset,
  incr
};
