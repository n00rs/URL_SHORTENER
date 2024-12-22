import { Router } from "express";
import { createLoginUsecase } from "../libs/auth/usecase";

const router = Router();
//
router.post("/login", async (req, res, next) => {
  try {
    const { email: strEmail, token: strToken } = req.body;

    const objLoginRes = await createLoginUsecase({ objBody: { strToken } });

    res.send(objLoginRes);
  } catch (err) {
    next(err);
  }
});
// will be implemented later
router.post("/logout", (req, res, next) => {
  try {
    const { strToekn } = req.body;
    console.log({ strToekn });
    res.send({ strToekn });
  } catch (err) {
    next(err);
  }
});
export default router;
