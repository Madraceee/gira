-- +goose Up
CREATE TABLE user_auth(
    user_id UUID,
    token TEXT,
    timestamp timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT user_auth_pk PRIMARY KEY (user_id,token)
);

-- +goose Down
DROP TABLE user_auth