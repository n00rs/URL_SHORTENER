import { TcreateUrlShortenUsecaseFactory } from "../urlshorten.model";
/**
 * Factory function to create the URL Shortening use case.
 * It integrates database, cache, and other dependencies required for creating shortened URLs.
 * 
 * @param {Object} param0 - The dependencies required to execute the URL shortening use case.
 * @param {Function} createShortenDb - A function to handle database interactions for URL shortening.
 * @param {Function} createRedisClient - A function to create and manage Redis clients.
 * @param {Function} getPgConnection - A function to obtain a PostgreSQL database connection.
 * @param {Function} setValueRedis - A function to set values in Redis for caching.
 * @param {Function} nanoid - A utility function to generate unique IDs for short URLs.
 * 
 * @returns {Function} - The URL shortening use case function.
 */
export default function createUrlShortenUsecaseFactory({
  createShortenDb,
  createRedisClient,
  getPgConnection,
  setValueRedis,
  nanoid,
}: Parameters<TcreateUrlShortenUsecaseFactory>[0]): ReturnType<TcreateUrlShortenUsecaseFactory> {
/**
   * The URL shortening use case function. Handles the process of generating
   * a shortened URL, storing it in the database, and caching the result in Redis.
   * 
   * @param {Object} param0 - Input parameters for the URL shortening use case.
   * @param {Object} param0.objBody - The request body containing data required for URL shortening.
   * @param {string} param0.objBody.strLongUrl - The original long URL to be shortened.
   * @param {string} param0.objBody.strTopic - Optional topic for categorizing the URL.
   * @param {string} param0.objBody.strcustomAlias - Optional custom alias for the shortened URL.
   * @param {number} param0.objBody.intUserId - User ID of the person creating the short URL.
   * @param {string} param0.objBody.strUserEmail - Email of the user creating the short URL.
   * @param {Object|null} param0.objConnection - Database connection object, if applicable.
   * 
   * @returns {Promise<Object>} - A promise that resolves to the details of the created shortened URL.
   */
  return async ({
    objBody: {
      strLongUrl = "",
      strTopic = "",
      strcustomAlias = "",
      intUserId = 0,
      strUserEmail = "",
    },
    objConnection = null,
  }) => {
    objConnection = objConnection || (await getPgConnection());

    try {
      //some basic validation
      if (!strLongUrl) throw new Error("PLEASE_PROVIDE_URL_TO_BE_SHORTEN");
      if (!intUserId) throw new Error("AUTHENTICATION_FAILED");
      //in case custom alias is not provided create unique alias by using nanoid package
      strcustomAlias = strcustomAlias?.trim() || nanoid(6);
      //create shorten URL
      const strShortenURL = process.env.BASE_URL + `/${strcustomAlias}`;
      //saving shorten URL details in DB
      const objCreateShortenUri = await createShortenDb({
        intUserId,
        strLongUrl: strLongUrl.trim(),
        strShortenURL: strShortenURL.trim(),
        strcustomAlias: strcustomAlias.trim(),
        strTopic: strTopic?.trim(),
        objConnection,
        blnCustomAlias: !!strcustomAlias,
      });
      //save the short url in redis
      const objRedisClient = await createRedisClient();
      await setValueRedis({
        objRedisClient,
        strKey: objCreateShortenUri.strcustomAlias,
        strValue:
          objCreateShortenUri.strLongUrl +
          `::__${objCreateShortenUri.intUrlPK}`,
        intExpiry: 60 * 60 * 24 * 30, //after 30 days it'll be removed
      });
      await objRedisClient.disconnect();
      return {
        strShortenURL: objCreateShortenUri.strShortenURL,
        datCreated: objCreateShortenUri.datCreated,
      };
    } catch (err) {
      throw new Error(err);
    }
  };
}
