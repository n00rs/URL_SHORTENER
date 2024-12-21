import { getLogDbFactory } from "./analyticsDb";
import objQueries from "./query";

const getLogDb = getLogDbFactory({ objQueries });

export { getLogDb };
