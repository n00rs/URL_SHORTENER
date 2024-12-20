import { TrateLimiterFactory } from "./verifyToken.model";
/**
 * Factory function to handle rate limiting logic for a user.
 * This function interacts with Redis to track and limit the number of requests a user can make within a given time period.
 *
 * @param {Object} param0 - Dependencies required for rate limiting.
 * @param {Function} param0.createRedisClient - Function to create a Redis client for interacting with the cache.
 * @param {Function} param0.getRedisValue - Function to get a value from Redis cache.
 * @param {Function} param0.setValueRedis - Function to set a value in Redis cache.
 *
 * @returns {Function} - A function that handles the rate limiting logic for a user.
 */
export default function rateLimiterFactory({
  createRedisClient,
  getRedisValue,
  setValueRedis,
}: Parameters<TrateLimiterFactory>[0]): ReturnType<TrateLimiterFactory> {
  /**
   * The main function that implements the rate limiting logic.
   * It checks if a user has exceeded the allowed number of requests within a specific time window.
   *
   * @param {Object} param0 - The input parameters for the rate limiting logic.
   * @param {string} param0.strUserEmail - The email of the user, used for identifying the rate limit for that user.
   * @param {number} param0.intUserId - The user ID, used as an additional identifier if needed.
   *
   * @returns {Promise<void>} 
   */
  return async ({ strUserEmail, intUserId }) => {
    try {
      const strRedisKey = `${strUserEmail}::__${intUserId}`;
      let intCount = 1;
      const objRedisClient = await createRedisClient();

      const strCount = await getRedisValue({
        objRedisClient,
        strKey: strRedisKey,
      });
      if (+strCount === +process.env.RATE_LIMIT_COUNT)
        throw new Error("TOO_MANY_REQUESTS_" + strUserEmail);
      intCount = +strCount + 1;
      await setValueRedis({
        objRedisClient,
        strKey: strRedisKey,
        strValue: intCount,
        intExpiry: +process.env.RATE_LIMIT_TIME_RANGE,
      });
    } catch (err) {
      throw new Error(err);
    }
  };
}
