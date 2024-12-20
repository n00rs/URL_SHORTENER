import { TobjQueries } from "../urlshorten.model";

const objQueries: TobjQueries = {
  objCreate: {
    strCreateShortenUrl: `INSERT INTO
    tbl_url(
        fk_bint_user_id,
        vchr_long_url,
        vchr_short_url,
        vchr_custom_alias,
        vchr_topic
    )
VALUES ($1, $2, $3, $4, $5) 
RETURNING 
    vchr_short_url AS "strShortenURL",
    vchr_custom_alias AS "strcustomAlias",
    vchr_long_url AS "strLongUrl",
    created_at AS "datCreated",
    pk_bint_url_id AS "intUrlPK"`,
    strCreateRedirectLog:`INSERT INTO
    tbl_redirect_log(
        fk_bint_url_id,
        fk_bint_user_id,
        vchr_os,
        vchr_device_type,
        json_extras
    )
VALUES
($1, $2, $3, $4, $5)`
  },
  objGet: {
    strGetShortenUrl: `SELECT pk_bint_url_id AS "intUrlPK",
                         vchr_long_url AS "strLongUrl"
                         FROM tbl_url WHERE vchr_custom_alias = $1`,
  },
};
export default objQueries;
