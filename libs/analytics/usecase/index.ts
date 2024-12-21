import { getPgConnection } from "../../common/functions";
import { getLogDb } from "../db";
import getAnalyticsUsecaseFactory from "./getAnalyticsUsecase";

const getAnalyticsUsecase = getAnalyticsUsecaseFactory({
  getLogDb,
  getPgConnection,
});

export { getAnalyticsUsecase };
