-- name: AssignUserToEpicPerms :one
INSERT INTO epic_assignment (epic_assignment_epic_id,epic_assignment_users_id,epic_assignment_role_id)
VALUES ($1,$2,$3)
RETURNING *;

-- name: DeleteUserFromEpic :exec
DELETE FROM epic_assignment
WHERE epic_assignment_users_id=$1;