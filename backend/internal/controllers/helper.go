package controllers

import (
	"context"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
)

func isUserActive(email string, DB *database.Queries, ctx context.Context) (bool, error) {

	status, err := DB.GetUserStatus(ctx, email)
	if err != nil {
		return false, err
	}

	if status == "ACTIVE" {
		return true, nil
	}

	return false, nil
}
