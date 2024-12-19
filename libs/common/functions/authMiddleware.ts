import { TverifyAccessTokenFactory } from "./verifyToken.model";

/**
 * Factory function to create a middleware for verifying access tokens.
 * @param param0 - Dependencies required for verifying tokens, such as Redis client creation and JWT methods.
 * @returns A middleware function that verifies the access token and adds user details to the request object.
 */
export default function verifyAccessTokenFactory({
  createRedisClient,
  createRedisRSAKEYS,
  getRedisValue,
  jwtDecode,
  jwtVerify,
}: Parameters<TverifyAccessTokenFactory>[0]): ReturnType<TverifyAccessTokenFactory> {
  /**
   * Middleware function to verify the access token.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The next middleware function in the chain.
   */
  return async (req, res, next) => {
    try {
      const strAcctoken: string = req.get("x-access-token");

      const strToken =
        strAcctoken?.startsWith("Bearer") &&
        strAcctoken?.split(" ")?.[1]?.trim();
      if (!strToken)
        throw { statusCode: 401, message: "NO_TOKEN_NO_AUTHORISATION" };

      const { intUserId, strUserEmail, strLoginTime, iat, exp } =
        jwtDecode(strToken);

      const objRedisClient = await createRedisClient();
      const objRedisKeys = createRedisRSAKEYS({
        intUserId,
      });

      const strAccPublicKey = await getRedisValue({
        objRedisClient,
        strKey: objRedisKeys.strAccPubKey,
      });
      await objRedisClient.disconnect();

      //verifing access_token
      const objDecode = jwtVerify({ strToken, strPublicKey: strAccPublicKey });
      if (!objDecode) throw new Error("REVOKED_TOKEN_PROVIDED");
      //adding token details to  request body data
      Object.assign(req.body, {
        intUserId,
        strUserEmail,
        strLoginTime,
      });
      next();
    } catch (err) {
      if (err?.name === "TokenExpiredError") err = "REVOKED_TOKEN_PROVIDED";

      next(err);
    }
  };
}
