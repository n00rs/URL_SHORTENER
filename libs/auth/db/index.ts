import { generatePublicPrivateKey } from "../../common/functions/verifyToken";
import { createLoginDbFactory } from "./authDb";
import objQueries from "./query";

const createLoginDb = createLoginDbFactory({ objQueries,generatePublicPrivateKey });
export { createLoginDb };
