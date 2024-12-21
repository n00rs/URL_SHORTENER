import { TobjQueries } from "../analytics.model";

const objQueries:TobjQueries = {
  objGet: {
    strGetLogDetails: `
SELECT
    trl.fk_bint_user_id AS "intUserId",
    trl.created_at :: DATE AS "datCreated",
    trl.vchr_os AS "strOs",
    trl.vchr_device_type AS "strDevice",
    trl.fk_bint_url_id AS "intUrlId",
    tu.vchr_short_url AS "strShortUrl"
FROM
    tbl_redirect_log trl
    LEFT JOIN tbl_url tu ON tu.pk_bint_url_id = trl.fk_bint_url_id
WHERE
    tu.bln_blocked = false 
    {WHERE} ORDER BY trl.created_at::DATE DESC;`,
  },
};
export default objQueries;
