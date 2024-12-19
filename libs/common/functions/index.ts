import { OAuth2Client } from "google-auth-library";
import { Pool, Client } from "pg";
import { jwtDecode, jwtVerify, verifyGoogleTokenFactory } from "./verifyToken";
import { getPgConnectionFactory } from "./dbConnections";
import {
  createRedisClientFactory,
  createRedisRSAKEYS,
  getRedisValue,
} from "./redisConfig";
import { createClient } from "redis";
import verifyAccessTokenFactory from "./authMiddleware";

const verifyGoogleToken = verifyGoogleTokenFactory({
  GoogleAuth2: OAuth2Client,
});

const getPgConnection = getPgConnectionFactory({
  PgClient: Client,
  PgPool: Pool,
});

const createRedisClient = createRedisClientFactory({ createClient });
const verifyAccessToken = verifyAccessTokenFactory({
  createRedisClient,
  createRedisRSAKEYS,
  getRedisValue,
  jwtDecode,
  jwtVerify,
});

export { verifyGoogleToken, getPgConnection, createRedisClient,verifyAccessToken };
