const Redis = require('ioredis');
require('dotenv').config();

let redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Clean up URL if it has quotes from env dashboard copies
redisUrl = redisUrl.replace(/^["']|["']$/g, '');

console.log(`[Redis] Connecting to: ${redisUrl.split('@')[1] || 'localhost'}`);

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    return delay;
  }
});

redis.on('connect', () => {
  console.log('[Redis] Connected');
});

redis.on('error', (err) => {
  console.error('[Redis] Connection Error', err);
});

module.exports = redis;
