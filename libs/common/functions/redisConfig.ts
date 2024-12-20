import { TcreateRedisClientFactory, TsetValueRedis } from "./verifyToken.model";

/**
 * Factory function to create a Redis client instance.
 * This allows you to abstract and reuse the Redis connection logic across your application.
 *
 * @param param0 - An object containing the `createClient` method to initialize the Redis client.
 * @returns A function that creates and connects a Redis client using the specified URL or a default environment variable.
 */
export function createRedisClientFactory({
  createClient,
}: Parameters<TcreateRedisClientFactory>[0]): ReturnType<TcreateRedisClientFactory> {
  /**
   * Creates and connects a Redis client.
   *
   * @param param0 - An object containing the optional `strUrl`, which is the Redis connection URL.
   * If `strUrl` is not provided, the function will use the `REDIS_URI` environment variable.
   * @returns A connected Redis client instance.
   */
  return async ({ strUrl = "" } = {}) => {
    try {
      const client = createClient({
        url: strUrl || process.env.REDIS_URI, // Change this if Redis is hosted remotely
      });
      client.on("connect", () => console.log("Connected to Redis!"));
      client.on("error", (err) => console.error("Redis Client Error:", err));
      await client.connect();
      return client;
    } catch (error) {
      throw new Error(error);
    }
  };
}

/**
 * Set a value in Redis
 * @param {string} strKey - The key to set.
 * @param {string} strValue - The value to store.
 * @param {number} [strExpiry] - Optional expiration time in seconds.
 * @returns {Promise<void>}
 */
export const setValueRedis = async ({
  strKey = "",
  strValue = "",
  intExpiry = 0,
  objRedisClient,
}:Parameters<TsetValueRedis>[0]) => {
  try {
    if (intExpiry) {
      await objRedisClient.set(strKey, strValue, { EX: intExpiry }); // Set with expiration
    } else {
      await objRedisClient.set(strKey, strValue); // Set without expiration
    }
    console.log(`Key "${strKey}" set successfully.`);
  } catch (err) {
    console.error("Error setting value in Redis:", err);
    throw new Error(err);
  }
};
/**
 * Get a value from Redis
 * @param {string} key - The key to retrieve.
 * @returns {Promise<string | null>} - The value stored in Redis, or null if the key does not exist.
 */
export async function getRedisValue({ strKey, objRedisClient }) {
  try {
    const value = await objRedisClient.get(strKey);
    if (value) {
      console.log(`Value for key "${strKey}":`, value);
    } else {
      console.log(`Key "${strKey}" does not exist.`);
    }
    return value;
  } catch (err) {
    console.error("Error getting value from Redis:", err);
    throw new Error(err);
  }
}

export function createRedisRSAKEYS({ intUserId }) {
  return {
    strAccPrivateKey: `RSA_ACC_PRIVATE_${intUserId}`,
    strRefrPrivateKey: `RSA_REFR_PRIVATE_${intUserId}`,
    strRefrPubKey: `RSA_REFR_PUBLIC_${intUserId}`,
    strAccPubKey: `RSA_ACC_PUBLIC_${intUserId}`,
  };
}
