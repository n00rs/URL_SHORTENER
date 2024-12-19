import { generateKeyPair } from "crypto";
import { TverifyGoogleTokenFactory } from "./verifyToken.model";
import jwt from "jsonwebtoken";
/**
 * Factory Function to verify Google Token
 * class to verify Outh2 is passed as parameter
 * @param param0
 * @returns function verifies google token and returns payload of login user
 */
export function verifyGoogleTokenFactory({
  GoogleAuth2,
}: Parameters<TverifyGoogleTokenFactory>[0]): ReturnType<TverifyGoogleTokenFactory> {
/**
 * function verifies google token and returns payload of login user  
 * @param param0{{strToken}} google token from request body
 * @returns
 */
  return async function verifyGoogleToken({ strToken }) {
    try {
      const strClientId: string = process.env.GOOGLE_CLIENT_ID;
      const googleClient = new GoogleAuth2({ clientId: strClientId });
      const objClientData = await googleClient.verifyIdToken({
        idToken: strToken,
        audience: strClientId,
      });

      return objClientData.getPayload();
    } catch (err) {
      throw new Error(err);
    }
  };
}

/**
 *   genrating keys
 * @returns {Promise<{strPublicKey, strPrivateKey}>}
 */

export const generatePublicPrivateKey = (): Promise<{
  strPublicKey: string;
  strPrivateKey: string;
}> => {
  return new Promise((res, reject) => {
    generateKeyPair(
      "rsa",
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      },
      (err, publicKey, privateKey) => {
        if (err) reject(err);
        res({ strPublicKey: publicKey, strPrivateKey: privateKey });
      }
    );
  });
};
/**
 *
 * @param param0
 * @returns {string} json web token for auth
 */
export const jwtSign = ({
  objPayload,
  strType = "ACCESS",
  strPrivateKey = "",
}): string => {
  //getting exp time of access and refr token
  const strExpTim =
    strType === "ACCESS"
      ? process.env.ACCESS_EXP_TIME
      : process.env.REFRESH_EXP_TIME;
  //creating  token

  return jwt.sign(objPayload, strPrivateKey, {
    // expiresIn:  "12h",
    algorithm: "RS256",
    expiresIn: strExpTim,
  });
};
/**
 * @param param0
 * @returns
 */
export const jwtVerify = ({ strToken, strPublicKey }) =>
  jwt.verify(strToken, strPublicKey, { algorithm: ["RS256"] });

/**
 *
 * @param strToken
 * @returns {Object} payload from token
 */
export const jwtDecode = (strToken) => jwt.decode(strToken);
