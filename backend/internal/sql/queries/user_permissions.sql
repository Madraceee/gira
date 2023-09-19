-- Get the user's permission for the EPIC and TASK
-- Needed for Authorizing resources and permissions

-- name: FetchEpicPermissions :many 
SELECT DISTINCT role_permission_permission_id from role_permission
JOIN epic_assignment
ON epic_assignment_role_id=role_permission_role_id AND role_permission_epic_id=epic_assignment_epic_id
WHERE epic_assignment_users_id=$1 AND epic_assignment_epic_id=$2;

-- name: FetchTaskPermissions :many
SELECT DISTINCT role_permission_permission_id from role_permission
JOIN task_assignment
ON role_permission_epic_id=task_assignment_epic_id AND role_permission_role_id=task_assignment_role_id
WHERE task_assignment_task_id=$1 AND task_assignment_users_id=$2;