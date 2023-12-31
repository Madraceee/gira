// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.21.0
// source: permission.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const enterPerms = `-- name: EnterPerms :one
INSERT INTO role_permission (role_permission_role_id,role_permission_epic_id,role_permission_permission_id)
VALUES ($1,$2,$3)
RETURNING role_permission_role_id, role_permission_epic_id, role_permission_permission_id
`

type EnterPermsParams struct {
	RolePermissionRoleID       int32
	RolePermissionEpicID       uuid.UUID
	RolePermissionPermissionID int32
}

func (q *Queries) EnterPerms(ctx context.Context, arg EnterPermsParams) (RolePermission, error) {
	row := q.db.QueryRowContext(ctx, enterPerms, arg.RolePermissionRoleID, arg.RolePermissionEpicID, arg.RolePermissionPermissionID)
	var i RolePermission
	err := row.Scan(&i.RolePermissionRoleID, &i.RolePermissionEpicID, &i.RolePermissionPermissionID)
	return i, err
}
