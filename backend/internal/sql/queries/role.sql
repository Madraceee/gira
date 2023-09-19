-- name: CreateEpicRole :one
INSERT INTO role (role_epic_id,role_name,role_category)
VALUES ($1,$2,'EPIC')
RETURNING *;


-- name: CreateTaskRole :one
INSERT INTO role (role_epic_id,role_name,role_category)
VALUES ($1,$2,'TASK')
RETURNING *;

-- name: GetRoleIDFromRoleName :one
SELECT role_id FROM role
WHERE role_epic_id=$1 AND role_name=$2;

-- name: GetRolesForTasksForEpic :many
SELECT role_name FROM role
WHERE role_epic_id=$1 AND role_category='TASK';

-- name: GetRolesForEpic :many
SELECT role_name FROM role
WHERE role_epic_id=$1 AND role_category='EPIC' AND role_name!='MASTER';