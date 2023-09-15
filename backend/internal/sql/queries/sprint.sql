-- name: CreateSprint :one
INSERT INTO sprint (sprint_epic_id,sprint_id,sprint_start_date,sprint_end_date)
VALUES ($1, (SELECT COUNT(*) FROM sprint WHERE sprint_epic_id=$1)+1, $2,$3)
RETURNING *;

-- name: UpdateSprint :one
UPDATE sprint
SET sprint_end_date=$3
WHERE sprint_epic_id=$1 AND sprint_id=$2
RETURNING *;

-- name: GetSprintWithOwner :one
SELECT sprint_id, epic_id , epic_owner FROM sprint
JOIN epic
ON sprint_epic_id = epic_id
WHERE epic_id=$1 AND sprint_id=$2;
