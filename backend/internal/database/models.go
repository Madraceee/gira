// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.21.0

package database

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type Epic struct {
	EpicID          uuid.UUID
	EpicName        string
	EpicDescription string
	EpicFeatures    string
	EpicLink        sql.NullString
	EpicStartDate   time.Time
	EpicEndDate     sql.NullTime
	EpicOwner       uuid.UUID
}

type EpicMember struct {
	EpicMembersUserID uuid.UUID
	EpicMembersEpicID uuid.UUID
}

type User struct {
	UsersID            uuid.UUID
	UsersEmail         string
	UsersName          string
	UsersAccountStatus string
	UsersType          string
	UsersPassword      string
}

type UserAuth struct {
	UserID            uuid.UUID
	UserAuthToken     string
	UserAuthTimestamp time.Time
}
