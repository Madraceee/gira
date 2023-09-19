-- name: InsertUserToken :exec
INSERT INTO user_auth (user_id,user_auth_token,user_auth_timestamp)
VALUES ($1,$2,$3);

-- name: GetUserToken :one
SELECT * FROM user_auth
WHERE user_id=$1;

-- name: DeleteUserToken :exec
DELETE FROM user_auth
WHERE user_id=$1;
