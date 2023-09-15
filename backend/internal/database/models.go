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

type Sprint struct {
	SprintEpicID    uuid.UUID
	SprintID        int32
	SprintStartDate time.Time
	SprintEndDate   time.Time
}

type Task struct {
	TaskEpicID    uuid.UUID
	TaskID        uuid.UUID
	TaskName      string
	TaskReq       string
	TaskLog       sql.NullString
	TaskLink      sql.NullString
	TaskStartDate time.Time
	TaskEndDate   sql.NullTime
	TaskStatus    string
	TaskSprintID  sql.NullInt32
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
