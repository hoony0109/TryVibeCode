const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redis.on('connect', () => console.log('Connected to Redis.'));
redis.on('error', (err) => console.error('Redis Client Error', err));

module.exports = redis;
