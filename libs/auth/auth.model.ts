import { Pool, Client } from "pg";
import {
  TcreateRedisClient,
  TcreateRedisRSAKEYS,
  TgeneratePublicPrivateKey,
  TgetPgConnection,
  TjwtSign,
  TsetValueRedis,
  TverifyGoogleToken,
} from "../common/functions/verifyToken.model";

//type definition for Queries object
export type TobjQueries = {
  objCreate: { strGetUSerData: string; strCreateUser: string };
};

//type definition for Login Factory function
export type TcreateLoginDbFactory = (objParams: {
  objQueries: TobjQueries;
  generatePublicPrivateKey:TgeneratePublicPrivateKey
}) => TcreateLoginDb;
//return type  of createLoginDb function
export type TobjLoginDb = {
  strAccPrivateKey: string;
  strRefrPrivateKey: string;
  strRefrPubKey: string;
  strAccPubKey: string;
  intUserId: number;
};

//type definition for create Login Db function
export type TcreateLoginDb = (objParams: {
  strMaild: string;
  strUserName: string;
  strImgUrl: string;
  objConnection: Pool | Client;
  objExtraJson;
}) => Promise<TobjLoginDb>;

//type definition for login use case function
export type TcreateLoginUsecase = (objParams: {
  objBody: { strToken: string; strMailId?: string };
  objConnection?: Pool | Client;
}) => Promise<{
  strMessage: "LOGIN_SUCCESS";
  strUserEmail: string;
  strId: number;
  strName: string;
  strAccToken: string;
  strRefrToken: string;
}>;

//type definitions create login usecase Factory function 
export type TcreateLoginUsecaseFactory = (objParams: {
  createLoginDb: TcreateLoginDb;
  verifyGoogleToken: TverifyGoogleToken;
  getPgConnection: TgetPgConnection;
  createRedisClient: TcreateRedisClient;
  createRedisRSAKEYS: TcreateRedisRSAKEYS;
  setValueRedis: TsetValueRedis;
  jwtSign: TjwtSign;
}) => TcreateLoginUsecase;
