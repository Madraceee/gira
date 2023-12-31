// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.21.0
// source: user_permissions.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const fetchEpicPermissions = `-- name: FetchEpicPermissions :many

SELECT DISTINCT role_permission_permission_id from role_permission
JOIN epic_assignment
ON epic_assignment_role_id=role_permission_role_id AND role_permission_epic_id=epic_assignment_epic_id
WHERE epic_assignment_users_id=$1 AND epic_assignment_epic_id=$2
`

type FetchEpicPermissionsParams struct {
	EpicAssignmentUsersID uuid.UUID
	EpicAssignmentEpicID  uuid.UUID
}

// Get the user's permission for the EPIC and TASK
// Needed for Authorizing resources and permissions
func (q *Queries) FetchEpicPermissions(ctx context.Context, arg FetchEpicPermissionsParams) ([]int32, error) {
	rows, err := q.db.QueryContext(ctx, fetchEpicPermissions, arg.EpicAssignmentUsersID, arg.EpicAssignmentEpicID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []int32
	for rows.Next() {
		var role_permission_permission_id int32
		if err := rows.Scan(&role_permission_permission_id); err != nil {
			return nil, err
		}
		items = append(items, role_permission_permission_id)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const fetchTaskPermissions = `-- name: FetchTaskPermissions :many
SELECT DISTINCT role_permission_permission_id from role_permission
JOIN task_assignment
ON role_permission_epic_id=task_assignment_epic_id AND role_permission_role_id=task_assignment_role_id
WHERE task_assignment_task_id=$1 AND task_assignment_users_id=$2
`

type FetchTaskPermissionsParams struct {
	TaskAssignmentTaskID  uuid.UUID
	TaskAssignmentUsersID uuid.UUID
}

func (q *Queries) FetchTaskPermissions(ctx context.Context, arg FetchTaskPermissionsParams) ([]int32, error) {
	rows, err := q.db.QueryContext(ctx, fetchTaskPermissions, arg.TaskAssignmentTaskID, arg.TaskAssignmentUsersID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []int32
	for rows.Next() {
		var role_permission_permission_id int32
		if err := rows.Scan(&role_permission_permission_id); err != nil {
			return nil, err
		}
		items = append(items, role_permission_permission_id)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
