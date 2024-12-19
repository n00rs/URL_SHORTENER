import { TcreateLoginUsecaseFactory } from "../auth.model";

/**
 * Factory function to create the login use case.
 * @param param0 - An object containing all the dependencies required for the login process.
 * @returns A function that handles user login, verifies Google tokens, saves user details, and generates JWT tokens.
 */
export default function createLoginUsecaseFactory({
  createLoginDb,
  verifyGoogleToken,
  getPgConnection,
  createRedisClient,
  createRedisRSAKEYS,
  setValueRedis,
  jwtSign,
}: Parameters<TcreateLoginUsecaseFactory>[0]): ReturnType<TcreateLoginUsecaseFactory> {
   /**
   * Function to handle user login.
   * @param param0 - An object containing the body of the request and an optional database connection.
   * @returns A success message along with user details and tokens.
   */
  return async ({
    objBody: { strToken = "", strMailId = "" },
    objConnection = null,
  }) => {
    objConnection = objConnection || (await getPgConnection());
    try {
      console.log(strToken, strMailId);
      if (!strToken) throw new Error("TOKEN_NOT_PROVIDED");
      //   verify google token0
      const objUserDetails = await verifyGoogleToken({ strToken });


      console.log(objUserDetails);
      // save user details in db
      const objUserData = await createLoginDb({
        strMaild: objUserDetails.email?.trim(),
        strUserName: objUserDetails?.name?.trim(),
        strImgUrl: objUserDetails?.picture?.trim(),
        objConnection,
        objExtraJson: objUserDetails,
      });
      const objRedisClient = await createRedisClient();
      const objRedisKeys = createRedisRSAKEYS({
        intUserId: objUserData.intUserId,
      });
      /**
       * setting public and private keys in redis
       */
      await Promise.all([
        setValueRedis({
          objRedisClient,
          strKey: objRedisKeys["strAccPubKey"],
          strValue: objUserData["strAccPubKey"],
        }),
        setValueRedis({
          objRedisClient,
          strKey: objRedisKeys["strAccPrivateKey"],
          strValue: objUserData["strAccPrivateKey"],
        }),
        setValueRedis({
          objRedisClient,
          strKey: objRedisKeys["strRefrPrivateKey"],
          strValue: objUserData["strRefrPrivateKey"],
        }),
        setValueRedis({
          objRedisClient,
          strKey: objRedisKeys["strRefrPubKey"],
          strValue: objUserData["strRefrPubKey"],
        }),
      ]);
      await objRedisClient.disconnect();

      // payload for token
      const objPayload = {
        intUserId: objUserData.intUserId,
        strUserEmail: objUserDetails.email,
        strLoginTime: new Date().toDateString(),
      };
      // access token
      const strAccToken = jwtSign({
        objPayload,
        strPrivateKey: objUserData["strAccPrivateKey"],
      });
      // refresh token
      const strRefrToken = jwtSign({
        objPayload,
        strType: "REFRESH",
        strPrivateKey: objUserData["strRefrPrivateKey"],
      });
      //create jwt and send success message
      return {
        strMessage: "LOGIN_SUCCESS",
        strUserEmail: objUserDetails["email"],
        strId: objUserData["intUserId"],
        strName: objUserDetails["name"],
        strAccToken,
        strRefrToken,
      };
    } catch (err) {
      throw new Error(err);
    }
  };
}
