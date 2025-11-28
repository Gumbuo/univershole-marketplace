import Redis from 'ioredis';

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  lazyConnect: true,
});

// Wrapper to match Vercel KV interface
export const kv = {
  async get(key: string) {
    try {
      const value = await redis.get(key);
      return value;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(key: string, value: string) {
    try {
      await redis.set(key, value);
      return 'OK';
    } catch (error) {
      console.error('Redis SET error:', error);
      throw error;
    }
  },

  async sadd(key: string, ...members: string[]) {
    try {
      return await redis.sadd(key, ...members);
    } catch (error) {
      console.error('Redis SADD error:', error);
      throw error;
    }
  },

  async smembers(key: string) {
    try {
      return await redis.smembers(key);
    } catch (error) {
      console.error('Redis SMEMBERS error:', error);
      return [];
    }
  },
};
