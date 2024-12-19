CREATE TABLE tbl_user(
    pk_bint_user_id SERIAL PRIMARY KEY,
    vchr_email VARCHAR(200) NOT NULL,
    vchr_name VARCHAR(200) DEFAULT '',
    vchr_password VARCHAR(500) default null,
    vchr_image_url VARCHAR(500) DEFAULT '',
    vchr_rsa_access_pub_key TEXT,
    vchr_rsa_access_prvt_key TEXT,
    vchr_rsa_refresh_pub_key TEXT,
    vchr_rsa_refresh_prvt_key TEXT,
    bln_blocked BOOLEAN DEFAULT false,
    json_extras JSONB
);

