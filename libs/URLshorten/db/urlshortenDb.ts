import {
  TobjCreateShortUrl,
  TcreateShortenDbFactory,
  TgetUrlShortDbFactory,
  TobjUrlDetails,
  TcreateRedirectLogDbFactory,
} from "../urlshorten.model";
/**
 * Factory function to create the URL shortening database interaction logic.
 * Handles the creation of shortened URLs, including optional custom aliases.
 * 
 * @param {Object} param0 - The dependencies required for database interactions.
 * @param {Object} param0.objQueries - An object containing SQL queries for URL shortening operations.
 * 
 * @returns {Function} - The database interaction function for URL shortening.
 */
export function createShortenDbFactory({
  objQueries,
}: Parameters<TcreateShortenDbFactory>[0]): ReturnType<TcreateShortenDbFactory> {
/**
   * The database interaction function for URL shortening.
   * Stores the long URL and its shortened version (and other related data) in the database.
   * 
   * @param {Object} param0 - Input parameters for storing URL data.
   * @param {boolean} param0.blnCustomAlias - Indicates if a custom alias was provided by the user.
   * @param {number} param0.intUserId - The user ID of the person creating the short URL.
   * @param {Object|null} param0.objConnection - Database connection object, if applicable.
   * @param {string} param0.strLongUrl - The original long URL to be shortened.
   * @param {string} param0.strShortenURL - The generated shortened URL.
   * @param {string} [param0.strTopic] - Optional topic or category for the URL.
   * @param {string} [param0.strcustomAlias] - Optional custom alias for the shortened URL.
   * 
   * @returns {Promise<Object>} - A promise that resolves with the stored URL details.
   */
  return async ({
    blnCustomAlias = false,
    intUserId = 0,
    objConnection = null,
    strLongUrl,
    strShortenURL,
    strTopic,
    strcustomAlias,
  }) => {
    try {
      console.log(objQueries);
      const arrParams = [
        intUserId,
        strLongUrl,
        strShortenURL,
        strcustomAlias,
        strTopic,
      ];
      const { rows: arrCreateShortUrl }: { rows: TobjCreateShortUrl[] } =
        await objConnection.query(
          objQueries.objCreate.strCreateShortenUrl,
          arrParams
        );
      console.log(arrCreateShortUrl);
      return arrCreateShortUrl[0];
    } catch (err) {
      console.log(err);
      if (err.constraint === "unique_alias_non_blocked")
        throw new Error("ALIAS_ALREADY_TAKEN");
      else throw new Error(err);
    }
  };
}
/**
 * Factory function to retrieve URL details from the database.
 * This function handles database interactions for fetching details of a shortened URL.
 * 
 * @param {Object} param0 - Dependencies required for database interactions.
 * @param {Object} param0.objQueries - An object containing SQL queries for URL retrieval operations.
 * 
 * @returns {Function} - A function that retrieves URL details from the database.
 */
export function getUrlShortDbFactory({
  objQueries,
}: Parameters<TgetUrlShortDbFactory>[0]) {
  /**
   * Function to fetch URL details from the database.
   * 
   * @param {Object} param0 - Input parameters for the database query.
   * @param {string} param0.strcustomAlias - The custom alias associated with the shortened URL.
   * @param {Object|null} param0.objConnection - Database connection object, if applicable.
   * 
   * @returns {Promise<Object>} - A promise that resolves with the retrieved URL details.
   */
  return async ({ strcustomAlias, objConnection }) => {
    try {
      console.log(strcustomAlias);
      const { rows: arrUrlDetails }: { rows: TobjUrlDetails[] } =
        await objConnection.query(objQueries.objGet.strGetShortenUrl, [
          strcustomAlias,
        ]);
      if (!arrUrlDetails.length) throw new Error("INVALID_URL");
      return arrUrlDetails[0];
    } catch (err) {
      throw new Error(err);
    }
  };
}
/**
 * Factory function to handle logging of redirect events in the database.
 * This function facilitates the creation of redirect logs to track user activity on shortened URLs.
 *
 * @param {Object} param0 - Dependencies required for database operations.
 * @param {Object} param0.objQueries - An object containing SQL queries for logging redirect events.
 *
 * @returns {Function} - A function that logs redirect events to the database.
 */
export function createRedirectLogDbFactory({
  objQueries,
}: Parameters<TcreateRedirectLogDbFactory>[0]): ReturnType<TcreateRedirectLogDbFactory> {
  /**
   * Function to log a redirect event in the database.
   *
   * @param {Object} param0 - Input parameters for the redirect log.
   * @param {number} param0.intUrlPK - The primary key of the shortened URL in the database.
   * @param {number} param0.intUserId - The ID of the user performing the redirect (if available).
   * @param {string} param0.strDevice - The type of device used for the redirect (e.g., mobile, desktop).
   * @param {string} param0.strIpAddress - The IP address of the user.
   * @param {string} param0.strOs - The operating system of the user (e.g., Windows, macOS, Android).
   * @param {string} param0.strcustomAlias - The custom alias of the shortened URL.
   * @param {Object|null} param0.objConnection - The database connection object.
   *
   * @returns {Promise<void>} - A promise that resolves when the log is successfully recorded.
   */
  return async ({
    intUrlPK,
    intUserId,
    strDevice,
    strIpAddress,
    strOs,
    strcustomAlias,
    objConnection,
  }) => {
    try {
      const arrParams = [
        intUrlPK,
        intUserId,
        strOs,
        strDevice,
        JSON.stringify({ strIpAddress }),
      ];
      const { rowCount } = await objConnection.query(
        objQueries.objCreate.strCreateRedirectLog,
        arrParams
      );
      if (rowCount !== 1) throw new Error("ERROR_WHILE_SAVING_LOG");
      return;
    } catch (err) {
      throw new Error(err);
    }
  };
}
