-- name: InsertEpicMember :one
INSERT INTO epic_members (epic_members_epic_id,epic_members_user_id)
VALUES ($1,(SELECT users_id FROM users WHERE users_email=$2))
RETURNING *;

-- name: GetEpicsOfUser :many
SELECT epic_id,epic_name FROM epic
JOIN epic_members
ON epic_id=epic_members_epic_id
WHERE epic_members_user_id=$1;


-- name: GetEpic :one
SELECT * FROM epic
JOIN epic_members
ON epic_id=epic_members_epic_id
WHERE epic_members_user_id=$1 AND epic_id=$2;

-- name: RemoveMember :exec
DELETE FROM epic_members
WHERE epic_members_epic_id=$1 AND epic_members_user_id=$2;
