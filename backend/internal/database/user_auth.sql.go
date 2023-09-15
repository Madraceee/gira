// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.21.0
// source: user_auth.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const deleteUserToken = `-- name: DeleteUserToken :exec
DELETE FROM user_auth
WHERE user_id=$1
`

func (q *Queries) DeleteUserToken(ctx context.Context, userID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteUserToken, userID)
	return err
}

const getUserToken = `-- name: GetUserToken :one
SELECT user_id, user_auth_token, user_auth_timestamp FROM user_auth
WHERE user_id=$1
`

func (q *Queries) GetUserToken(ctx context.Context, userID uuid.UUID) (UserAuth, error) {
	row := q.db.QueryRowContext(ctx, getUserToken, userID)
	var i UserAuth
	err := row.Scan(&i.UserID, &i.UserAuthToken, &i.UserAuthTimestamp)
	return i, err
}

const insertUserToken = `-- name: InsertUserToken :exec
INSERT INTO user_auth (user_id,user_auth_token)
VALUES ($1,$2)
`

type InsertUserTokenParams struct {
	UserID        uuid.UUID
	UserAuthToken string
}

func (q *Queries) InsertUserToken(ctx context.Context, arg InsertUserTokenParams) error {
	_, err := q.db.ExecContext(ctx, insertUserToken, arg.UserID, arg.UserAuthToken)
	return err
}
