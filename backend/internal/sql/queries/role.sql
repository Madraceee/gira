-- name: CreateMasterEpicRole :one
INSERT INTO role (role_epic_id,role_name,role_category)
VALUES ($1,$2,'EPIC')
RETURNING *;


-- name: CreateTaskRole :one
INSERT INTO role (role_epic_id,role_name,role_category)
VALUES ($1,$2,'TASK')
RETURNING *;