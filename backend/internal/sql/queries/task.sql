-- name: CreateTask :one
INSERT INTO task(task_epic_id,task_id,task_name,task_req,task_start_date,task_end_date,task_status)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING *;

-- name: UpdateTaskStatus :one
UPDATE task
SET task_status=$3
WHERE task_epic_id=$1 AND task_id=$2
RETURNING *;

-- name: UpdateTaskSprintStatus :exec
UPDATE task
SET task_sprint_id=NULL
WHERE task_epic_id=$1 AND task_sprint_id=$2;

-- name: UpdateTaskFull :one
UPDATE task
set task_status=$3,task_link=$4,task_log=$5,task_sprint_id=$6
WHERE task_epic_id=$1 AND task_id=$2
RETURNING *;