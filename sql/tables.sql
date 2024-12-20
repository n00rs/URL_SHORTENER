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

CREATE TABLE tbl_url(
    pk_bint_url_id SERIAL PRIMARY KEY,
    fk_bint_user_id INT NOT NULL,
    vchr_long_url TEXT NOT NULL,
    vchr_short_url VARCHAR(200) NOT NULL,
    vchr_custom_alias VARCHAR(150),
    vchr_topic VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    bln_blocked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY(fk_bint_user_id) REFERENCES tbl_user(pk_bint_user_id)
);

-- Unique constraint on vchr_custom_alias when bln_blocked is false
CREATE UNIQUE INDEX unique_alias_non_blocked ON tbl_url(vchr_custom_alias)
WHERE
    bln_blocked = FALSE;

CREATE TABLE IF NOT EXISTS tbl_redirect_log(
    pk_bint_redirect_log_id SERIAL PRIMARY KEY,
    fk_bint_user_id INT NOT NULL,
    fk_bint_url_id INT NOT NULL,
    vchr_os VARCHAR(100) NOT NULL,
    vchr_device_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    json_extras JSONB,
    --for saving extra datas like ip 
    FOREIGN KEY(fk_bint_user_id) REFERENCES tbl_user(pk_bint_user_id),
    FOREIGN KEY(fk_bint_url_id) REFERENCES tbl_url(pk_bint_url_id)
);
