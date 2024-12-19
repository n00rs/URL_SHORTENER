import {
  verifyGoogleToken,
  getPgConnection,
  createRedisClient,
} from "../../common/functions";
import {
  createRedisRSAKEYS,
  setValueRedis,
} from "../../common/functions/redisConfig";
import { jwtSign } from "../../common/functions/verifyToken";
import { createLoginDb } from "../db";
import createLoginUsecaseFactory from "./loginUsecase";

const createLoginUsecase = createLoginUsecaseFactory({
  createLoginDb,
  verifyGoogleToken,
  getPgConnection,
  createRedisClient,
  createRedisRSAKEYS,
  jwtSign,
  setValueRedis,
});

export { createLoginUsecase };
