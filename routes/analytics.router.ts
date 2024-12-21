import { Router } from "express";
import { getAnalyticsUsecase } from "../libs/analytics/usecase";

const routes = Router();

routes.get("/overall", async (req, res, next) => {
  try {
    const { intUserId } = req.body;

    const objTopicData = await getAnalyticsUsecase({
      objBody: { intUserId, strType: "OVERALL" },
    });
    res.send(objTopicData);
  } catch (err) {
    throw new Error(err);
  }
});

//
routes.get("/:alias", async (req, res, next) => {
  try {
    const { alias: strcustomAlias } = req.params;

    const objAliasData = await getAnalyticsUsecase({
      objBody: {  strType: "ALIAS", strcustomAlias },
    });
    res.send(objAliasData);
  } catch (err) {
    throw new Error(err);
  }
});
routes.get("/topics/:topic", async (req, res, next) => {
  try {
    const { topic: strTopic } = req.params;

    const objTopicData = await getAnalyticsUsecase({
      objBody: {  strType: "TOPIC", strTopic },
    });
    res.send(objTopicData);
  } catch (err) {
    throw new Error(err);
  }
});
export default routes;
