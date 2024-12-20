import { TgetUrlShortUsecaseFactory } from "../urlshorten.model";

/**
 * Factory function to handle URL redirection use cases.
 * This function integrates database operations, caching, and analytics for URL redirection.
 *
 * @param {Object} param0 - Dependencies required for the use case.
 * @param {Function} param0.createRedirectLogDb - Function to log redirect events in the database.
 * @param {Function} param0.getUrlShortDb - Function to fetch details of the shortened URL from the database.
 * @param {Function} param0.createRedisClient - Function to create a Redis client for caching.
 * @param {Function} param0.getPgConnection - Function to establish a PostgreSQL database connection.
 * @param {Function} param0.parseUserAgent - Function to parse the user agent string for analytics.
 * @param {Function} param0.getRedisValue - Function to retrieve values from Redis cache.
 * @param {Function} param0.setValueRedis - Function to set values in Redis cache.
 *
 * @returns {Function} - A function that processes the URL redirection use case.
 */
export default function getUrlShortUsecaseFactory({
  createRedirectLogDb,
  getUrlShortDb,
  createRedisClient,
  getPgConnection,
  parseUserAgent,
  getRedisValue,
  setValueRedis,
}: Parameters<TgetUrlShortUsecaseFactory>[0]): ReturnType<TgetUrlShortUsecaseFactory> {
  /**
   * Processes the URL redirection logic.
   * Handles caching, database queries, and logging redirect events.
   *
   * @param {Object} param0 - Input parameters for processing the redirection.
   * @param {Object} param0.objBody - The body of the request containing necessary details.
   * @param {string} param0.objBody.strcustomAlias - The custom alias of the shortened URL.
   * @param {number} param0.objBody.intUserId - The ID of the user performing the action.
   * @param {string} param0.objBody.strIpAddress - The IP address of the user.
   * @param {string} param0.objBody.strUserAgent - The user agent string of the client's browser.
   * @param {string} param0.objBody.strUserEmail - The email of the user (if applicable).
   * @param {Object|null} param0.objConnection - Database connection object, if applicable.
   *
   * @returns {Promise<any>} - A promise that resolves after processing the URL redirection logic.
   */
  return async ({
    objBody: {
      strcustomAlias = "",
      intUserId = 0,
      strIpAddress,
      strUserAgent,
      strUserEmail,
    },
    objConnection = null,
  }) => {
    objConnection = objConnection || (await getPgConnection());
    try {
      //basic validation
      if (!strcustomAlias) throw new Error("PLEASE_PROVIDE_ALIAS");
      //first check whether the data exist in redis
      const objRedisClient = await createRedisClient();
      let arrLongUrl: string[] = (
        await getRedisValue({
          objRedisClient,
          strKey: strcustomAlias.trim(),
        })
      )?.split("::__");
      let strLongUrl = arrLongUrl?.[0];
      let intUrlPK = +arrLongUrl?.[1];
      if (!arrLongUrl?.length) {
        const objUrlData = await getUrlShortDb({
          objConnection,
          strcustomAlias,
        });
        strLongUrl = objUrlData.strLongUrl;
        intUrlPK = objUrlData.intUrlPK;
        await setValueRedis({
          objRedisClient,
          strKey: strcustomAlias,
          strValue: strLongUrl + `::__${intUrlPK}`,
          intExpiry: 60 * 60 * 24 * 30, //after 30 days it'll be removed
        });
      }
      objRedisClient.disconnect();
      const { strDevice, strOs } = parseUserAgent(strUserAgent);

      const obj = await createRedirectLogDb({
        strcustomAlias,
        intUserId,
        strDevice,
        strOs,
        strIpAddress,
        intUrlPK,
        objConnection,
      });

      console.log(strLongUrl);
      return strLongUrl;
    } catch (err) {
      throw new Error(err);
    }
  };
}
