import { createClient } from '@vercel/kv';

// Create KV client using REDIS_URL if KV_URL is not available
export const kv = createClient({
  url: process.env.KV_REST_API_URL || process.env.REDIS_URL!,
  token: process.env.KV_REST_API_TOKEN || 'not-needed-for-redis-url',
});
