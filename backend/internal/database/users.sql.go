// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.21.0
// source: users.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (id,email,name,account_status,user_type,password)
VALUES ($1,$2,$3,$4,$5,$6)
RETURNING id, email, name, account_status, user_type, password
`

type CreateUserParams struct {
	ID            uuid.UUID
	Email         string
	Name          string
	AccountStatus string
	UserType      string
	Password      string
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser,
		arg.ID,
		arg.Email,
		arg.Name,
		arg.AccountStatus,
		arg.UserType,
		arg.Password,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Name,
		&i.AccountStatus,
		&i.UserType,
		&i.Password,
	)
	return i, err
}
