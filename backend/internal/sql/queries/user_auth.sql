-- name: InsertUserToken :exec
INSERT INTO user_auth (user_id,token)
VALUES ($1,$2);

-- name: GetUserToken :one
SELECT * FROM user_auth
WHERE user_id=$1;

-- name: DeleteUserToken :exec
DELETE FROM user_auth
WHERE user_id=$1;