-- name: CreateUser :one
INSERT INTO users (users_id,users_email,users_name,users_account_status,users_type,users_password)
VALUES ($1,$2,$3,$4,$5,$6)
RETURNING *;

-- name: DeactivateAccount :exec
UPDATE users
SET users_account_status='DEACTIVE'
WHERE users_id=$1;

-- name: ActivateAccount :exec
UPDATE users
SET users_account_status='ACTIVE'
WHERE users_id=$1;


-- name: Login :one
SELECT * FROM users
WHERE users_email=$1;

-- name: GetEpicMembers :many
SELECT users_name,users_email FROM users
JOIN epic_members
ON users_id=epic_members_user_id
WHERE epic_members_epic_id=$1;

-- name: GetIDFromEmail :one
SELECT users_id FROM users
WHERE users_email=$1;

