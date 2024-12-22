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
      if (!strToken) throw new Error("TOKEN_NOT_PROVIDED");
      //   verify google token0
      const objUserDetails = await verifyGoogleToken({ strToken });
      // const objUserDetails = {
      //   iss: "https://accounts.google.com",
      //   azp: "776116297541-4pu91g6e8jquc1fitr0n5b0ql5a5coe1.apps.googleusercontent.com",
      //   aud: "776116297541-4pu91g6e8jquc1fitr0n5b0ql5a5coe1.apps.googleusercontent.com",
      //   sub: "101770523992358983985",
      //   hd: "nucore.in",
      //   email: "noorsha_@nucore.in",
      //   email_verified: true,
      //   nbf: 1734602565,
      //   name: "Noorsha Shaheen",
      //   picture:
      //     "https://lh3.googleusercontent.com/a/ACg8ocJH2KUSXQs3awlI1JCDu-I8bGd7X7_KfGNPx8AhUE13sP9b2A=s96-c",
      //   given_name: "Noorsha",
      //   family_name: "Shaheen\t",
      //   iat: 1734602865,
      //   exp: 1734606465,
      //   jti: "686db79e2fb992f31dab0b9640f9cef3f802b49c",
      // };

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
