import { Router } from "express";

const router = Router();
// 
router.get("/:alias", (req, res, next) => {
  try {
    const { alias: strAlias } = req.params;
    console.log({ strAlias });

    res.send({ strAlias });
  } catch (err) {
    throw new Error(err);
  }
});
// 
router.post("/", (req, res, next) => {
  try {
    const {
      longUrl: strLongUrl,
      customAlias: strcustomAlias,
      topic: strTopic,
    } = req.body;
    console.log({ strLongUrl, strTopic, strcustomAlias });
    res.send({ strLongUrl, strTopic, strcustomAlias });
  } catch (err) {
    throw new Error(err);
  }
});
export default router;
