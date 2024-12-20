import { RedisCommandArgument } from "@redis/client/dist/lib/commands";
import { NextFunction, Request, Response } from "express";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { Pool, Client } from "pg";
import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
//
export type TverifyGoogleToken = (objParams: {
  strToken: string;
}) => Promise<TokenPayload>;

//
export type TverifyGoogleTokenFactory = (objParams: {
  GoogleAuth2: typeof OAuth2Client;
}) => TverifyGoogleToken;

export type TgetPgConnection = (objParams?: {
  strDbName?: string;
  strHost?: string;
  strPort?: string;
  blnPool?: boolean;
}) => Promise<Pool | Client>;
//
export type TgetPgConnectionFactory = (objParams: {
  PgClient: typeof Client;
  PgPool: typeof Pool;
}) => TgetPgConnection;
//
type TredisClient = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
//
export type TcreateRedisClient = (objParams?: {
  strUrl?: string;
}) => Promise<TredisClient>;
//
export type TcreateRedisClientFactory = (params: {
  createClient: typeof createClient;
}) => TcreateRedisClient;
//
export type TcreateRedisRSAKEYS = (objParams: { intUserId: number }) => {
  strAccPrivateKey: string;
  strRefrPrivateKey: string;
  strRefrPubKey: string;
  strAccPubKey: string;
};
//
export type TsetValueRedis = (objParams: {
  strKey?: RedisCommandArgument;
  strValue?: RedisCommandArgument | number;
  intExpiry?: number;
  objRedisClient: TredisClient;
}) => Promise<void>;
//
export type TgetRedisValue = (objParams: {
  strKey: string;
  objRedisClient: TredisClient;
}) => Promise<any>;
//
export type TjwtSign = (objParams: {
  objPayload: any;
  strType?: string;
  strPrivateKey?: string;
}) => string;

//
export type TjwtVerify = (objParams: {
  strToken: string;
  strPublicKey: string;
}) => any;

//
export type TjwtDecode = (strToken: string) => any;

export type TverifyAccessTokenFactory = (objParams: {
  createRedisClient: TcreateRedisClient;
  createRedisRSAKEYS: TcreateRedisRSAKEYS;
  getRedisValue: TgetRedisValue;
  jwtDecode: TjwtDecode;
  jwtVerify: TjwtVerify;
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

export type TgeneratePublicPrivateKey = () => Promise<{
  strPublicKey: string;
  strPrivateKey: string;
}>;

export type TrateLimiterFactory = (objParams: {
  createRedisClient: TcreateRedisClient;
  getRedisValue: TgetRedisValue;
  setValueRedis: TsetValueRedis;
}) => TrateLimiter;

//
export type TrateLimiter = (objParams: {
  strUserEmail: string;
  intUserId: string;
}) => Promise<void>;
