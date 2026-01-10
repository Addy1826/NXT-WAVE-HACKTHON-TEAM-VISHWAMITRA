import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

let client: RedisClientType | null = null;

export async function connectRedis(): Promise<void> {
    try {
        const url = process.env.REDIS_URL || 'redis://localhost:6379';
        // Try to connect; if local redis is not available, log and continue (non-fatal for dev)
        client = createClient({ url });
        client.on('error', (err) => logger.warn(`Redis client error: ${String(err)}`));
        await client.connect();
        logger.info('Redis connected successfully');
    } catch (error) {
        logger.warn('Redis connection failed; continuing without cache');
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


