export default {
  objCreate: {
    strGetUSerData:`SELECT 
                            vchr_rsa_access_prvt_key AS "strAccPrivateKey", 
                            vchr_rsa_refresh_prvt_key AS "strRefrPrivateKey",
                            vchr_rsa_refresh_pub_key AS "strRefrPubKey",
                            vchr_rsa_access_pub_key AS "strAccPubKey",
                            pk_bint_user_id AS "intUserId"
                            FROM tbl_user WHERE vchr_email = $1 AND bln_blocked = false`,
    strCreateUser:`INSERT INTO
    tbl_user(
        vchr_email,
        vchr_name,
        vchr_image_url,
        vchr_rsa_access_pub_key,
        vchr_rsa_access_prvt_key,
        vchr_rsa_refresh_pub_key,
        vchr_rsa_refresh_prvt_key,
        json_extras
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING 
    vchr_rsa_access_prvt_key AS "strAccPrivateKey", 
    vchr_rsa_refresh_prvt_key AS "strRefrPrivateKey", 
    vchr_rsa_refresh_pub_key AS "strRefrPubKey",
    vchr_rsa_access_pub_key AS "strAccPubKey",
    pk_bint_user_id AS "intUserId"`                            
  },
};
