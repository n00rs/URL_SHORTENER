import { Router } from "express";
import {
  createUrlShortenUsecase,
  getUrlShortUsecase,
} from "../libs/URLshorten/usecase";
import { rateLimiter } from "../libs/common/functions";

const router = Router();
//
router.get("/:alias", async (req, res, next) => {
  try {
    // getting IP address
    let strIpAddress = req.socket.remoteAddress;
    if (typeof req.headers["x-forwarded-for"] === "string")
      strIpAddress = req.headers["x-forwarded-for"]?.split(",").shift();

    const strUserAgent = req.headers["user-agent"] || "";
    const { alias: strcustomAlias } = req.params;
    const { intUserId, strUserEmail } = req.body;
    console.log({ strcustomAlias });
    //getting redirect URL and creating log
    const strRedirectUrl = await getUrlShortUsecase({
      objBody: {
        strcustomAlias,
        intUserId,
        strUserEmail,
        strUserAgent,
        strIpAddress,
      },
    });
    res.redirect(strRedirectUrl);
  } catch (err) {
    next(err);
  }
});
//
router.post("/", async (req, res, next) => {
  try {
    //getting data from request body
    const {
      longUrl: strLongUrl,
      customAlias: strcustomAlias,
      topic: strTopic,
      intUserId,
      strUserEmail,
    } = req.body;
    // check limit whether the user is continuously calling this api
    await rateLimiter({ intUserId, strUserEmail });
    const objCreateRes = await createUrlShortenUsecase({
      objBody: {
        intUserId,
        strcustomAlias,
        strLongUrl,
        strTopic,
        strUserEmail,
      },
    });

    res.send(objCreateRes);
  } catch (err) {
    next(err);
  }
});
export default router;
