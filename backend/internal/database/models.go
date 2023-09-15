// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.21.0

package database

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID            uuid.UUID
	Email         string
	Name          string
	AccountStatus string
	UserType      string
	Password      string
}

type UserAuth struct {
	UserID    uuid.UUID
	Token     string
	Timestamp time.Time
}
