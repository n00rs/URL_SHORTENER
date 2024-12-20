import objQueries from "./query";
import {
  createRedirectLogDbFactory,
  createShortenDbFactory,
  getUrlShortDbFactory,
} from "./urlshortenDb";

const createShortenDb = createShortenDbFactory({ objQueries });
const createRedirectLogDb = createRedirectLogDbFactory({ objQueries });
const getUrlShortDb = getUrlShortDbFactory({ objQueries });
export { createShortenDb, getUrlShortDb, createRedirectLogDb };
