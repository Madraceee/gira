// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.21.0
// source: task_assignment.sql

package database

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

const addUserToTask = `-- name: AddUserToTask :one
INSERT INTO task_assignment (task_assignment_task_id,task_assignment_epic_id,task_assignment_users_id,task_assignment_role_id)
VALUES ($1,$2,$3,$4)
RETURNING task_assignment_task_id, task_assignment_epic_id, task_assignment_users_id, task_assignment_role_id
`

type AddUserToTaskParams struct {
	TaskAssignmentTaskID  uuid.UUID
	TaskAssignmentEpicID  uuid.UUID
	TaskAssignmentUsersID uuid.UUID
	TaskAssignmentRoleID  int32
}

func (q *Queries) AddUserToTask(ctx context.Context, arg AddUserToTaskParams) (TaskAssignment, error) {
	row := q.db.QueryRowContext(ctx, addUserToTask,
		arg.TaskAssignmentTaskID,
		arg.TaskAssignmentEpicID,
		arg.TaskAssignmentUsersID,
		arg.TaskAssignmentRoleID,
	)
	var i TaskAssignment
	err := row.Scan(
		&i.TaskAssignmentTaskID,
		&i.TaskAssignmentEpicID,
		&i.TaskAssignmentUsersID,
		&i.TaskAssignmentRoleID,
	)
	return i, err
}

const checkUserTaskMappingExists = `-- name: CheckUserTaskMappingExists :one
SELECT task_assignment_task_id, task_assignment_epic_id, task_assignment_users_id, task_assignment_role_id FROM task_assignment
WHERE task_assignment_epic_id=$1 AND task_assignment_task_id=$2 AND task_assignment_users_id=$3
`

type CheckUserTaskMappingExistsParams struct {
	TaskAssignmentEpicID  uuid.UUID
	TaskAssignmentTaskID  uuid.UUID
	TaskAssignmentUsersID uuid.UUID
}

func (q *Queries) CheckUserTaskMappingExists(ctx context.Context, arg CheckUserTaskMappingExistsParams) (TaskAssignment, error) {
	row := q.db.QueryRowContext(ctx, checkUserTaskMappingExists, arg.TaskAssignmentEpicID, arg.TaskAssignmentTaskID, arg.TaskAssignmentUsersID)
	var i TaskAssignment
	err := row.Scan(
		&i.TaskAssignmentTaskID,
		&i.TaskAssignmentEpicID,
		&i.TaskAssignmentUsersID,
		&i.TaskAssignmentRoleID,
	)
	return i, err
}

const deleteUserFromAllTask = `-- name: DeleteUserFromAllTask :exec
DELETE FROM task_assignment
WHERE task_assignment_users_id=$1
`

func (q *Queries) DeleteUserFromAllTask(ctx context.Context, taskAssignmentUsersID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteUserFromAllTask, taskAssignmentUsersID)
	return err
}

const deleteUserFromTask = `-- name: DeleteUserFromTask :exec
DELETE FROM task_assignment
WHERE task_assignment_users_id=$1 AND task_assignment_task_id=$2
`

type DeleteUserFromTaskParams struct {
	TaskAssignmentUsersID uuid.UUID
	TaskAssignmentTaskID  uuid.UUID
}

func (q *Queries) DeleteUserFromTask(ctx context.Context, arg DeleteUserFromTaskParams) error {
	_, err := q.db.ExecContext(ctx, deleteUserFromTask, arg.TaskAssignmentUsersID, arg.TaskAssignmentTaskID)
	return err
}

const getUsersTask = `-- name: GetUsersTask :many
SELECT task_id,task_name,task_req,task_log,task_link,task_start_date,task_end_date,task_status,task_sprint_id FROM task
JOIN task_assignment
ON task_assignment_epic_id=task_epic_id AND task_id=task_assignment_task_id
WHERE task_epic_id=$1 AND task_assignment_users_id=$2
`

type GetUsersTaskParams struct {
	TaskEpicID            uuid.UUID
	TaskAssignmentUsersID uuid.UUID
}

type GetUsersTaskRow struct {
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

func (q *Queries) GetUsersTask(ctx context.Context, arg GetUsersTaskParams) ([]GetUsersTaskRow, error) {
	rows, err := q.db.QueryContext(ctx, getUsersTask, arg.TaskEpicID, arg.TaskAssignmentUsersID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetUsersTaskRow
	for rows.Next() {
		var i GetUsersTaskRow
		if err := rows.Scan(
			&i.TaskID,
			&i.TaskName,
			&i.TaskReq,
			&i.TaskLog,
			&i.TaskLink,
			&i.TaskStartDate,
			&i.TaskEndDate,
			&i.TaskStatus,
			&i.TaskSprintID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateUserTask = `-- name: UpdateUserTask :exec
UPDATE task_assignment 
SET task_assignment_role_id=$4
WHERE task_assignment_task_id=$1 AND task_assignment_epic_id=$2 AND task_assignment_users_id=$3
`

type UpdateUserTaskParams struct {
	TaskAssignmentTaskID  uuid.UUID
	TaskAssignmentEpicID  uuid.UUID
	TaskAssignmentUsersID uuid.UUID
	TaskAssignmentRoleID  int32
}

func (q *Queries) UpdateUserTask(ctx context.Context, arg UpdateUserTaskParams) error {
	_, err := q.db.ExecContext(ctx, updateUserTask,
		arg.TaskAssignmentTaskID,
		arg.TaskAssignmentEpicID,
		arg.TaskAssignmentUsersID,
		arg.TaskAssignmentRoleID,
	)
	return err
}
