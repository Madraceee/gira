package controllers

// ROLES
// MASTER -> ALL PERMS
// Reviewer -> View only
// Tester-> View only, change status and log when status is TESTING
// Developer-> Full control of the TASK

// Change to role based. No need to check for user global role,
// Add service to take user, task, epic and return all the permissions
// Each function can then decide what to do

// --------------------
// BREAKING
// --------------------

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/common"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/service"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/utils"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type TaskConfig struct {
	DB *database.Queries
}

func (taskCfg *TaskConfig) CreateTask(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	// Input from user to create an Task
	type parameters struct {
		EpicID       uuid.UUID `json:"epic_id"`
		Name         string    `json:"name"`
		Requirements string    `json:"req"`
		Start_date   time.Time `json:"start_date"`
		End_date     time.Time `json:"end_date"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, 400, "Invalid Input")
		return
	}

	perms, err := service.FetchEpicPermissions(params.EpicID, user.Id, taskCfg.DB, r.Context())

	isAllowed := false
	for _, v := range perms {
		if v == 102 {
			isAllowed = true
		}
	}

	if isAllowed == false {
		utils.RespondWithError(w, http.StatusForbidden, "Not Allowed")
		return
	}

	var end_date sql.NullTime
	if !params.End_date.IsZero() {
		end_date.Time = params.End_date
		end_date.Valid = true
	} else {
		end_date.Valid = false
	}

	// Create Task
	task, err := taskCfg.DB.CreateTask(r.Context(), database.CreateTaskParams{
		TaskEpicID:    params.EpicID,
		TaskID:        uuid.New(),
		TaskName:      params.Name,
		TaskReq:       params.Requirements,
		TaskStartDate: params.Start_date,
		TaskEndDate:   end_date,
		TaskStatus:    "NOT STARTED",
	})

	if err != nil {
		log.Printf("Error while inserting into DB by %v : %v", user.Email, err.Error())
		utils.RespondWithError(w, http.StatusBadRequest, "Input Error")
		return
	}

	roleId, _ := taskCfg.DB.GetRoleIDFromRoleName(r.Context(), database.GetRoleIDFromRoleNameParams{
		RoleEpicID: params.EpicID,
		RoleName:   "Developer",
	})

	// Adding Creator as developer of task
	taskCfg.DB.AddUserToTask(r.Context(), database.AddUserToTaskParams{
		TaskAssignmentTaskID:  task.TaskID,
		TaskAssignmentEpicID:  params.EpicID,
		TaskAssignmentUsersID: user.Id,
		TaskAssignmentRoleID:  roleId,
	})

	utils.RespondWithJSON(w, http.StatusOK, task)
}

func (taskCfg *TaskConfig) FetchUsersTask(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	epicId := chi.URLParam(r, "id")

	parsedId, err := uuid.Parse(epicId)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Malfomed ID")
		return
	}

	taskList, err := taskCfg.DB.GetUsersTask(r.Context(), database.GetUsersTaskParams{
		TaskEpicID:            parsedId,
		TaskAssignmentUsersID: user.Id,
	})

	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			utils.RespondWithJSON(w, http.StatusOK, nil)
			return
		}
		utils.RespondWithError(w, http.StatusInternalServerError, "Malfomed ID")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, taskList)
	return

}

func (taskCfg *TaskConfig) FetchTaskPermissions(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	taskID := chi.URLParam(r, "taskID")
	parsedTaskId, err := uuid.Parse(taskID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong ID")
		return
	}

	ans, err := service.FetchTaskermissions(parsedTaskId, user.Id, taskCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Data Does not exist")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, ans)
	return
}

// Update FRONTEND and Backend
func (taskCfg *TaskConfig) UpdateTaskStatus(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	// MASTER can Update Tasks
	// Assigned Members(Developer and Tester) can also change
	// Tester can change only from Testing to Review || Building
	role := strings.ToUpper(user.Role)
	if role != "MASTER" && true {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Not Authorized to update Task status")
		return
	}

	// Parse request parameters
	type parameters struct {
		EpicID uuid.UUID `json:"epic_id"`
		TaskID uuid.UUID `json:"task_id"`
		Status string    `json:"status"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	// Execute the SQL query to update task status
	updatedTask, err := taskCfg.DB.UpdateTaskStatus(r.Context(), database.UpdateTaskStatusParams{
		TaskEpicID: params.EpicID,
		TaskID:     params.TaskID,
		TaskStatus: params.Status,
	})

	if err != nil {
		log.Printf("Error while updating task status by %v : %v", user.Email, err.Error())
		utils.RespondWithError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, updatedTask)
}

func (taskCfg *TaskConfig) UpdateTaskFull(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	// Parse request parameters
	type parameters struct {
		EpicID   uuid.UUID `json:"epic_id"`
		TaskID   uuid.UUID `json:"task_id"`
		SprintID int       `json:"sprint_id"`
		Link     string    `json:"link"`
		Log      string    `json:"log"`
		Status   string    `json:"status"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	perms, err := service.FetchTaskermissions(params.TaskID, user.Id, taskCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
		return
	}

	isAllowed := false
	for _, perm := range perms {
		if perm == 3 {
			isAllowed = true
			break
		}
	}
	if isAllowed == false {
		utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
		return
	}

	sqlLink := sql.NullString{}
	if len(params.Link) > 0 {
		sqlLink = sql.NullString{
			String: params.Link,
			Valid:  true,
		}
	}

	sqlLog := sql.NullString{}
	if len(params.Log) > 0 {
		sqlLog = sql.NullString{
			String: params.Log,
			Valid:  true,
		}
	}

	sqlSprintID := sql.NullInt32{}
	if params.SprintID > 0 {
		sqlSprintID = sql.NullInt32{
			Int32: int32(params.SprintID),
			Valid: true,
		}
	}

	updatedTask, err := taskCfg.DB.UpdateTaskFull(r.Context(), database.UpdateTaskFullParams{
		TaskEpicID:   params.EpicID,
		TaskID:       params.TaskID,
		TaskStatus:   params.Status,
		TaskLink:     sqlLink,
		TaskLog:      sqlLog,
		TaskSprintID: sqlSprintID,
	})

	if err != nil {
		log.Printf("Error while updating task by %v : %v", user.Email, err.Error())
		utils.RespondWithError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, updatedTask)
}

// Get The Roles for a Task
func (taskCfg *TaskConfig) GetAllPermsOfTask(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	epicID := chi.URLParam(r, "epicID")
	parsedEpicID, err := uuid.Parse(epicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong ID")
		return
	}

	roles, err := taskCfg.DB.GetRolesForTasksForEpic(r.Context(), parsedEpicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong ID")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, roles)
}

func (taskCfg *TaskConfig) AddUserToTask(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	type parameter struct {
		EpicID      uuid.UUID `json:"epic_id"`
		TaskID      uuid.UUID `json:"task_id"`
		MemberEmail string    `json:"member_email"`
		RoleName    string    `json:"role_name"`
	}

	params := parameter{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	perms, err := service.FetchTaskermissions(params.TaskID, user.Id, taskCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	isAllowed := false
	for _, perm := range perms {
		if perm == 4 {
			isAllowed = true
			break
		}
	}

	if isAllowed == false {
		utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
		return
	}

	// Get Member ID from email
	memberID, err := taskCfg.DB.GetIDFromEmail(r.Context(), params.MemberEmail)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "User not found")
		return
	}

	// Check whether the member is part of the EPIC
	_, err = taskCfg.DB.CheckMemberInEpic(r.Context(), database.CheckMemberInEpicParams{
		EpicMembersEpicID: params.EpicID,
		EpicMembersUserID: memberID,
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "User does not exist in Epic")
		return
	}

	roleId, _ := taskCfg.DB.GetRoleIDFromRoleName(r.Context(), database.GetRoleIDFromRoleNameParams{
		RoleEpicID: params.EpicID,
		RoleName:   params.RoleName,
	})

	// Adding Creator as developer of task
	task, err := taskCfg.DB.AddUserToTask(r.Context(), database.AddUserToTaskParams{
		TaskAssignmentTaskID:  params.TaskID,
		TaskAssignmentEpicID:  params.EpicID,
		TaskAssignmentUsersID: memberID,
		TaskAssignmentRoleID:  roleId,
	})
	if err != nil {
		log.Printf("Cannot assign user to task : %v", err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Cannot assign user to task")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, task)
	return
}
