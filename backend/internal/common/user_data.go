package common

import "github.com/google/uuid"

type UserData struct {
	Email string
	Id    uuid.UUID
	Role  string
}
