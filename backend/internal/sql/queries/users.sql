-- name: CreateUser :one
INSERT INTO users (id,email,name,account_status,user_type,password)
VALUES ($1,$2,$3,$4,$5,$6)
RETURNING *;

-- name: Login :one
SELECT * FROM users
WHERE email=$1;

