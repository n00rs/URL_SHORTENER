import { Router } from "express";

const routes = Router();

//
routes.get("/:alias", (req, res, next) => {
  try {
    const { alias } = req.params;
    console.log(alias);
    res.send({ alias });
  } catch (err) {
    throw new Error(err);
  }
});
routes.get("/topics/:topic", (req, res, next) => {
  try {
    const { topic: strTopic } = req.params;
    console.log(strTopic);
    res.send({ strTopic });
  } catch (err) {
    throw new Error(err);
  }
});
routes.get("/overall", (req, res, next) => {
  try {
    res.send({ alias: "overall" });
  } catch (err) {
    throw new Error(err);
  }
});
export default routes;
