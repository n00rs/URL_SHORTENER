import { OAuth2Client } from "google-auth-library";
import { Pool, Client } from "pg";
import { jwtDecode, jwtVerify, verifyGoogleTokenFactory } from "./verifyToken";
import { getPgConnectionFactory } from "./dbConnections";
import {
  createRedisClientFactory,
  createRedisRSAKEYS,
  getRedisValue,
  setValueRedis,
} from "./redisConfig";
import { createClient } from "redis";
import verifyAccessTokenFactory from "./authMiddleware";
import rateLimiterFactory from "./rateLimiter";

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

const rateLimiter = rateLimiterFactory({
  createRedisClient,
  getRedisValue,
  setValueRedis,
});
export {
  verifyGoogleToken,
  getPgConnection,
  createRedisClient,
  verifyAccessToken,
  rateLimiter
};
