import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

let client: RedisClientType | null = null;

export async function connectRedis(): Promise<void> {
    const useRedis = process.env.USE_REDIS !== 'false';
    const redisUrl = process.env.REDIS_URL;

    if (!useRedis || !redisUrl) {
        logger.warn('⚠️ Redis disabled or URL missing. Caching turned off (Demo Mode).');
        // Create a mock client that does nothing but doesn't crash
        client = {
            connect: async () => { },
            quit: async () => { },
            get: async () => null,
            set: async () => 'OK',
            del: async () => 1,
            on: () => { },
            isOpen: true
        } as unknown as RedisClientType;
        return;
    }

    try {
        client = createClient({ url: redisUrl });
        client.on('error', (err) => logger.warn(`Redis client error: ${String(err)}`));
        await client.connect();
        logger.info('✅ Redis connected successfully');
    } catch (error) {
        logger.warn('⚠️ Redis connection failed; continuing without cache (Mock Mode)');
        // Fallback to mock if connection fails
        client = {
            connect: async () => { },
            quit: async () => { },
            get: async () => null,
            set: async () => 'OK',
            del: async () => 1,
            on: () => { },
            isOpen: true
        } as unknown as RedisClientType;
    }
}

export function getRedisClient(): RedisClientType | null {
    return client;
}

export async function disconnectRedis(): Promise<void> {
    try {
        if (client) {
            await client.quit();
            logger.info('Redis disconnected successfully');
        }
    } catch (error) {
        logger.warn('Error disconnecting Redis');
    }
}


