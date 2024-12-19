import { Router } from "express";

const router = Router();
//
router.post("/login", (req, res, next) => {
  try {
    const { email: strEmail, token: strToken } = req.body;
    console.log({ strEmail,strToken });

    res.send({ strEmail,strToken });
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
