import { createShortenDb, createRedirectLogDb, getUrlShortDb } from "../db";
import createUrlShortenUsecaseFactory from "./createUrlShortenUsecase";
import getUrlShortUsecaseFactory from "./getUrlShortUsecase";
import { createRedisClient, getPgConnection } from "../../common/functions";
import {
  getRedisValue,
  setValueRedis,
} from "../../common/functions/redisConfig";
import { parseUserAgent } from "../../common/functions/parseUserAgent";
const { nanoid } = require("nanoid");

const createUrlShortenUsecase = createUrlShortenUsecaseFactory({
  createShortenDb,
  createRedisClient,
  getPgConnection,
  nanoid,
  setValueRedis,
});

const getUrlShortUsecase = getUrlShortUsecaseFactory({
  createRedirectLogDb,
  getUrlShortDb,
  createRedisClient,
  getPgConnection,
  getRedisValue,
  parseUserAgent,
  setValueRedis,
});

export { createUrlShortenUsecase, getUrlShortUsecase };
