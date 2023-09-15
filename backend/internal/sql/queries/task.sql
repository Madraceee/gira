-- name: CreateTask :one
INSERT INTO task(task_epic_id,task_id,task_name,task_req,task_start_date,task_end_date,task_status)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING *;

-- name: UpdateTaskStatus :one
UPDATE task
SET task_status=$3
WHERE task_epic_id=$1 AND task_id=$2
RETURNING *;

-- name: UpdateTaskEndDate :one
UPDATE task
SET task_end_date=$3
WHERE task_epic_id=$1 AND task_id=$2
RETURNING *;

-- name: UpdateTaskLog :one
UPDATE task
SET task_log=$3
WHERE task_epic_id=$1 AND task_id=$2
RETURNING *;

-- name: UpdateTaskLink :one
UPDATE task
SET task_link=$3
WHERE task_epic_id=$1 AND task_id=$2
RETURNING *;

-- name: UpdateTaskSprintID :one
UPDATE task
SET task_sprint_id=$3
WHERE task_epic_id=$1 AND task_id=$2
RETURNING *;