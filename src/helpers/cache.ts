const Redis = require('ioredis');
import config from '../config';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

redis.on('connect', () => {
  console.log('Redis connected!');
});
