-- name: InsertEpicMember :one
INSERT INTO epic_members (epic_members_epic_id,epic_members_user_id)
VALUES ($1,$2)
RETURNING *;

