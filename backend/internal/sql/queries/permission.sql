-- name: EnterPerms :one
INSERT INTO role_permission (role_permission_role_id,role_permission_epic_id,role_permission_permission_id)
VALUES ($1,$2,$3)
RETURNING *;