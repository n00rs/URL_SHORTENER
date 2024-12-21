import { TgetPgConnectionFactory } from "./verifyToken.model";

/**
 * Factory function to create a PostgreSQL connection.
 * This function abstracts the logic for creating a connection with either
 * a PostgreSQL client or a connection pool, depending on the input parameters.
 *
 * @param param0 - An object containing the `PgClient` and `PgPool` classes
 *                 as dependencies, typically provided by an external library.
 * @returns A function that establishes a connection to the PostgreSQL database
 *          based on the provided configuration options.
 */
export function getPgConnectionFactory({
  PgClient,
  PgPool,
}: Parameters<TgetPgConnectionFactory>[0]): ReturnType<TgetPgConnectionFactory> {
  /**
   * The returned function creates a PostgreSQL connection.
   *
   * @param param0 - An object containing connection parameters:
   *   @param {string} [strDbName=""] - The name of the database to connect to. Defaults to the value of `PG_DB_NAME` environment variable.
   *   @param {string} [strHost=""] - The database host. Defaults to the value of `PG_HOST` environment variable.
   *   @param {string} [strPort=""] - The port on which the database is running. Defaults to the value of `PG_PORT` environment variable.
   *   @param {boolean} [blnPool=false] - Flag to indicate whether to use a connection pool. Defaults to `false`.
   * @returns Either a connected `PgClient` or a `PgPool` instance, based on the `blnPool` flag.
   */
  return async ({
    strDbName = "",
    strHost = "",
    strPort = "",
    blnPool = false,
  } = {}) => {
    try {
      if (blnPool) {
        const pool = new PgPool({
          user: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
          host: strHost || process.env.PG_HOST,
          port: strPort || process.env.PG_PORT,
          database: strDbName || process.env.PG_DB_NAME,
        });
        return pool;
      }
      const client = new PgClient({
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: strHost || process.env.PG_HOST,
        port: strPort || process.env.PG_PORT,
        database: strDbName || process.env.PG_DB_NAME,
      });
      await client.connect();
      return client;
    } catch (err) {
      throw new Error(err);
    }
  };
}
