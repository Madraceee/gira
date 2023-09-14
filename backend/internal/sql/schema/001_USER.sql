-- +goose Up
CREATE TABLE users (
    id UUID PRIMARY KEY, 
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    account_status VARCHAR(20) NOT NULL,
    user_type VARCHAR(10) NOT NULL,
    password TEXT NOT NULL,
    CONSTRAINT chk_acc_status CHECK (account_status IN ('ACTIVE','DEACTIVE')),
    CONSTRAINT chk_user_type CHECK (user_type IN ('MASTER','MEMBER'))
);

-- +goose Down
DROP TABLE users;

