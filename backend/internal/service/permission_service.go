package service

import (
	"context"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/google/uuid"
)

func CreateEpicRole(epicID uuid.UUID, roleName string, perms []int, DB *database.Queries, r context.Context) (int32, error) {
	epicRole, err := DB.CreateEpicRole(r, database.CreateEpicRoleParams{
		RoleEpicID: epicID,
		RoleName:   roleName,
	})

	if err != nil {
		return 0, err
	}

	for _, id := range perms {
		_, err := DB.EnterPerms(r, database.EnterPermsParams{
			RolePermissionRoleID:       epicRole.RoleID,
			RolePermissionEpicID:       epicID,
			RolePermissionPermissionID: int32(id),
		})
		if err != nil {
			continue
		}
	}

	return epicRole.RoleID, nil
}

func CreateTaskRole(epicID uuid.UUID, roleName string, perms []int, DB *database.Queries, r context.Context) (int32, error) {
	taskRole, err := DB.CreateTaskRole(r, database.CreateTaskRoleParams{
		RoleEpicID: epicID,
		RoleName:   roleName,
	})

	if err != nil {
		return 0, err
	}

	for _, id := range perms {
		_, err := DB.EnterPerms(r, database.EnterPermsParams{
			RolePermissionRoleID:       taskRole.RoleID,
			RolePermissionEpicID:       epicID,
			RolePermissionPermissionID: int32(id),
		})
		if err != nil {
			continue
		}
	}

	return taskRole.RoleID, nil
}
