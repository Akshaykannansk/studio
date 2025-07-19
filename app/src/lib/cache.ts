/**
 * @fileoverview Redis cache service.
 * Connects to Redis and provides simple get/set/del methods for caching.
 * The cache key includes a version prefix to allow for easy invalidation of all keys.
 */
import { createClient } from 'redis';

const CACHE_VERSION = 'v1';

let redisClient: ReturnType<typeof createClient> | null = null;
let isRedisConnected = false;

async function getClient() {
    if (!redisClient) {
        const url = process.env.REDIS_URL;
        if (!url) {
            console.warn('REDIS_URL is not set. Caching will be disabled.');
            return null;
        }

        redisClient = createClient({ url });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error', err)
            isRedisConnected = false;
        });
        redisClient.on('connect', () => {
            isRedisConnected = true;
            console.log('Connected to Redis');
        });
        redisClient.on('end', () => {
            isRedisConnected = false;
            console.log('Disconnected from Redis');
        });

        try {
            await redisClient.connect();
        } catch (err) {
            console.error('Failed to connect to Redis:', err);
        }
    }
    return redisClient;
}

function getCacheKey(key: string): string {
    return `${CACHE_VERSION}:${key}`;
}

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        const client = await getClient();
        if (!client || !isRedisConnected) return null;

        try {
            const data = await client.get(getCacheKey(key));
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting cache for key ${key}:`, error);
            return null;
        }
    },

    async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
        const client = await getClient();
        if (!client || !isRedisConnected) return;

        try {
            const stringValue = JSON.stringify(value);
            await client.set(getCacheKey(key), stringValue, {
                EX: ttlSeconds,
            });
        } catch (error) {
            console.error(`Error setting cache for key ${key}:`, error);
        }
    },

    async del(key: string): Promise<void> {
        const client = await getClient();
        if (!client || !isRedisConnected) return;

        try {
            await client.del(getCacheKey(key));
        } catch (error) {
            console.error(`Error deleting cache for key ${key}:`, error);
        }
    },
};

// Gracefully disconnect on process exit
process.on('SIGINT', async () => {
    if (redisClient && redisClient.isOpen) {
        await redisClient.quit();
    }
    process.exit();
});
