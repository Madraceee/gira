-- name: CreateEpic :one
INSERT INTO epic (epic_id,epic_name,epic_description,epic_features,epic_link,epic_start_date,epic_end_date,epic_owner)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
RETURNING *;

-- name: UpdateEpic :exec
UPDATE epic
SET epic_description=$2,epic_features=$3,epic_end_date=$4
WHERE epic_id=$1;

-- name: DeleteEpic :exec
DELETE FROM epic
WHERE epic_id=$1;

-- name: GetEpicFromEpicID :one
SELECT * FROM epic WHERE epic_id=$1;
