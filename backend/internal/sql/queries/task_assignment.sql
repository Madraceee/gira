-- name: DeleteUserFromTask :exec
DELETE FROM task_assignment
WHERE task_assignment_users_id=$1;

-- name: AddUserToTask :one
INSERT INTO task_assignment (task_assignment_task_id,task_assignment_epic_id,task_assignment_users_id,task_assignment_role_id)
VALUES ($1,$2,$3,$4)
RETURNING *;

-- name: GetUsersTask :many
SELECT task_id,task_name,task_req,task_log,task_link,task_start_date,task_end_date,task_status,task_sprint_id FROM task
JOIN task_assignment
ON task_assignment_epic_id=task_epic_id AND task_id=task_assignment_task_id
WHERE task_epic_id=$1 AND task_assignment_users_id=$2;