import { Pool, Client } from "pg";
import {
  TcreateRedisClient,
  TgetPgConnection,
  TgetRedisValue,
  TsetValueRedis,
} from "../common/functions/verifyToken.model";
import { TparseUserAgent } from "../common/functions/parseUserAgent";
export type TobjQueries = {
  objCreate: {
    strCreateShortenUrl: string;
    strCreateRedirectLog: string;
  };
  objGet: {
    strGetShortenUrl: string;
  };
};

//

export type TcreateShortenDb = (objParams: {
  intUserId: number;
  strLongUrl: string;
  strShortenURL: string;
  strcustomAlias: string;
  strTopic: string;
  objConnection: Pool | Client;
  blnCustomAlias: boolean;
}) => Promise<TobjCreateShortUrl>;

//

export type TcreateShortenDbFactory = (objParams: {
  objQueries: TobjQueries;
}) => TcreateShortenDb;
//
export type TcreateUrlShortenUsecase = (objParams: {
  objBody: {
    strLongUrl: string;
    strTopic?: string;
    strcustomAlias?: string;
    intUserId: number;
    strUserEmail?: string;
  };
  objConnection?: Pool | Client;
}) => Promise<{
  strShortenURL: string;
  datCreated: Date;
}>;
//
export type TcreateUrlShortenUsecaseFactory = (objParams: {
  createShortenDb: TcreateShortenDb;
  createRedisClient: TcreateRedisClient;
  getPgConnection: TgetPgConnection;
  setValueRedis: TsetValueRedis;
  nanoid: (size?: number) => string;
}) => TcreateUrlShortenUsecase;

//
export type TobjCreateShortUrl = {
  strShortenURL: string;
  strcustomAlias: string;
  datCreated: Date;
  strLongUrl: string;
  intUrlPK: number;
};

//
export type TgetUrlShortDbFactory = (objParams: {
  objQueries: TobjQueries;
}) => TgetUrlShortDb;

//
export type TgetUrlShortDb = (objParams: {
  strcustomAlias: string;
  objConnection: string;
}) => Promise<TobjUrlDetails>;

export type TcreateRedirectLogDbFactory = (objParams: {
  objQueries: TobjQueries;
}) => TcreateRedirectLogDb;

//
export type TcreateRedirectLogDb = (objParams: {
  strcustomAlias: string;
  intUserId: number;
  strDevice: string;
  strOs: string;
  strIpAddress: string;
  intUrlPK: number;
  objConnection:Pool | Client
}) => Promise<void>;
//
export type TgetUrlShortUsecase = (objParams: {
  objBody: {
    strcustomAlias?: string;
    intUserId: number;
    strUserEmail: string;
    strUserAgent: string;
    strIpAddress: string;
  };
  objConnection?: Pool | Client;
}) => Promise<string>;
//
export type TgetUrlShortUsecaseFactory = (objParams: {
  createRedirectLogDb: TcreateRedirectLogDb;
  getUrlShortDb: TgetUrlShortDb;
  createRedisClient:TcreateRedisClient,
  getPgConnection:TgetPgConnection,
  parseUserAgent:TparseUserAgent,
  getRedisValue:TgetRedisValue,
  setValueRedis:TsetValueRedis,
}) => TgetUrlShortUsecase;

//
export type TobjUrlDetails = { intUrlPK: number; strLongUrl: string };
