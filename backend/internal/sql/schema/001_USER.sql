-- +goose Up
CREATE TABLE users (
    users_id UUID PRIMARY KEY, 
    users_email TEXT NOT NULL UNIQUE,
    users_name TEXT NOT NULL,
    users_account_status VARCHAR(20) NOT NULL,
    users_type VARCHAR(10) NOT NULL,
    users_password TEXT NOT NULL,
    CONSTRAINT users_chk_acc_status CHECK (users_account_status IN ('ACTIVE','DEACTIVE')),
    CONSTRAINT users_chk_user_type CHECK (users_type IN ('MASTER','MEMBER'))
);

-- +goose Down
DROP TABLE users;

