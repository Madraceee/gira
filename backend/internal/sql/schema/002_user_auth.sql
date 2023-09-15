-- +goose Up
CREATE TABLE user_auth(
    user_id UUID,
    user_auth_token TEXT,
    user_auth_timestamp timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT user_auth_pk PRIMARY KEY (user_id,user_auth_token),
    CONSTRAINT user_auth_fk_user_id FOREIGN KEY (user_id) REFERENCES users (users_id)
);

-- +goose Down
DROP TABLE user_auth;
