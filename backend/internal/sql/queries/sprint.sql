-- name: CreateSprint :one
INSERT INTO sprint (sprint_epic_id,sprint_id,sprint_start_date,sprint_end_date)
VALUES ($1, (SELECT COUNT(*) FROM sprint WHERE sprint_epic_id=$1)+1, $2,$3)
RETURNING *;

-- name: DeleteSprint :exec
DELETE from sprint
WHERE sprint_id=$1 AND sprint_epic_id=$2;

-- name: GetSprintWithOwner :one
SELECT sprint_id, epic_id , epic_owner FROM sprint
JOIN epic
ON sprint_epic_id = epic_id
WHERE epic_id=$1 AND sprint_id=$2;

-- name: GetSprintsOfEpic :many
SELECT sprint_id, sprint_start_date, sprint_end_date FROM sprint
JOIN epic_members
ON sprint_epic_id = epic_members_epic_id
WHERE epic_members_epic_id=$1 AND epic_members_user_id=$2;