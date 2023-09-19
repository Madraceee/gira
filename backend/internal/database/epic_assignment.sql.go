// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.21.0
// source: epic_assignment.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const assignUserToEpicPerms = `-- name: AssignUserToEpicPerms :one
INSERT INTO epic_assignment (epic_assignment_epic_id,epic_assignment_users_id,epic_assignment_role_id)
VALUES ($1,$2,$3)
RETURNING epic_assignment_epic_id, epic_assignment_users_id, epic_assignment_role_id
`

type AssignUserToEpicPermsParams struct {
	EpicAssignmentEpicID  uuid.UUID
	EpicAssignmentUsersID uuid.UUID
	EpicAssignmentRoleID  int32
}

func (q *Queries) AssignUserToEpicPerms(ctx context.Context, arg AssignUserToEpicPermsParams) (EpicAssignment, error) {
	row := q.db.QueryRowContext(ctx, assignUserToEpicPerms, arg.EpicAssignmentEpicID, arg.EpicAssignmentUsersID, arg.EpicAssignmentRoleID)
	var i EpicAssignment
	err := row.Scan(&i.EpicAssignmentEpicID, &i.EpicAssignmentUsersID, &i.EpicAssignmentRoleID)
	return i, err
}

const deleteUserFromEpic = `-- name: DeleteUserFromEpic :exec
DELETE FROM epic_assignment
WHERE epic_assignment_users_id=$1
`

func (q *Queries) DeleteUserFromEpic(ctx context.Context, epicAssignmentUsersID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteUserFromEpic, epicAssignmentUsersID)
	return err
}
