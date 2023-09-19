package service

import (
	"context"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/google/uuid"
)

func FetchEpicPermissions(epicId uuid.UUID, userId uuid.UUID, DB *database.Queries, r context.Context) ([]int32, error) {
	perms, err := DB.FetchEpicPermissions(r, database.FetchEpicPermissionsParams{
		EpicAssignmentUsersID: userId,
		EpicAssignmentEpicID:  epicId,
	})

	if err != nil {
		return []int32{}, err
	}

	return perms, nil
}

func FetchTaskermissions(taskId uuid.UUID, userId uuid.UUID, DB *database.Queries, r context.Context) ([]int32, error) {
	perms, err := DB.FetchTaskPermissions(r, database.FetchTaskPermissionsParams{
		TaskAssignmentTaskID:  taskId,
		TaskAssignmentUsersID: userId,
	})

	if err != nil {
		return []int32{}, err
	}

	return perms, nil
}
