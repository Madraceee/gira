package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
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

type EpicConfig struct {
	DB *database.Queries
}

func (epicCfg *EpicConfig) CreateEpic(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	// Allow only MASTERS to create EPIC
	role := strings.ToUpper(user.Role)
	if role != "MASTER" {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Not Authorized to create EPIC")
	}

	// Input from user to create an EPIC
	type parameters struct {
		Name        string    `json:"name"`
		Description string    `json:"desc"`
		Features    string    `json:"features"`
		Link        string    `json:"link"`
		Start_date  time.Time `json:"start_date"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, 400, "Invalid Input")
		return
	}

	var link sql.NullString
	if params.Link != "" {
		link.String = params.Link
		link.Valid = true
	} else {
		link.Valid = false
	}

	// Frontend should ensure the fields are set properly else empty string will be created.
	epic, err := epicCfg.DB.CreateEpic(r.Context(), database.CreateEpicParams{
		EpicID:          uuid.New(),
		EpicName:        params.Name,
		EpicDescription: params.Description,
		EpicFeatures:    params.Features,
		EpicStartDate:   params.Start_date,
		EpicEndDate:     sql.NullTime{},
		EpicLink:        link,
		EpicOwner:       user.Id,
	})

	if err != nil {
		log.Printf("Error while inserting into DB by %v : %v", user.Email, err.Error())
		utils.RespondWithError(w, http.StatusBadRequest, "Input Error")
		return
	}

	// Add Master to the EPIC_MEMBER table
	_, err = epicCfg.DB.InsertEpicMember(r.Context(), database.InsertEpicMemberParams{
		EpicMembersEpicID: epic.EpicID,
		UsersEmail:        user.Email,
	})

	// Create Roles
	// Master Role for EPIC(access to everything)
	epicRole, err := epicCfg.DB.CreateEpicRole(r.Context(), database.CreateEpicRoleParams{
		RoleEpicID: epic.EpicID,
		RoleName:   "MASTER",
	})

	// Assigning Permissions to MASTER
	permissions := []int{100, 101, 102, 103, 104, 105}
	for _, id := range permissions {
		_, err := epicCfg.DB.EnterPerms(r.Context(), database.EnterPermsParams{
			RolePermissionRoleID:       epicRole.RoleID,
			RolePermissionEpicID:       epic.EpicID,
			RolePermissionPermissionID: int32(id),
		})
		if err != nil {
			continue
		}
	}

	// Assign Owner to MASTER role
	_, err = epicCfg.DB.AssignUserToEpicPerms(r.Context(), database.AssignUserToEpicPermsParams{
		EpicAssignmentEpicID:  epic.EpicID,
		EpicAssignmentRoleID:  epicRole.RoleID,
		EpicAssignmentUsersID: user.Id,
	})

	// Create Developer and View Role Tasks
	// For Developer
	taskRole, err := epicCfg.DB.CreateTaskRole(r.Context(), database.CreateTaskRoleParams{
		RoleEpicID: epic.EpicID,
		RoleName:   "Developer",
	})

	for i := 1; i <= 5; i++ {
		_, err := epicCfg.DB.EnterPerms(r.Context(), database.EnterPermsParams{
			RolePermissionRoleID:       taskRole.RoleID,
			RolePermissionEpicID:       epic.EpicID,
			RolePermissionPermissionID: int32(i),
		})
		if err != nil {
			continue
		}
	}

	// For View
	taskRole, err = epicCfg.DB.CreateTaskRole(r.Context(), database.CreateTaskRoleParams{
		RoleEpicID: epic.EpicID,
		RoleName:   "View",
	})
	_, err = epicCfg.DB.EnterPerms(r.Context(), database.EnterPermsParams{
		RolePermissionRoleID:       taskRole.RoleID,
		RolePermissionEpicID:       epic.EpicID,
		RolePermissionPermissionID: int32(1),
	})

	if err != nil {
		log.Printf("Error while making epic %v", err)
	}

	if err != nil {
		utils.RespondWithError(w, 500, "Server Error")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, epic)
}

// Add member to an EPIC
// Add member to an EPIC
func (epicCfg *EpicConfig) AddMemberToEpic(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	type parameters struct {
		EpicId    uuid.UUID `json:"epic_id"`
		UserEmail string    `json:"user_email"`
	}

	json := json.NewDecoder(r.Body)
	params := parameters{}
	err := json.Decode(&params)

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	if params.UserEmail == user.Email {
		utils.RespondWithError(w, http.StatusBadRequest, "Cannot Add Self")
		return
	}

	perms, err := service.FetchEpicPermissions(params.EpicId, user.Id, epicCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	// Checking whether the Initiator has permission to add user to epic
	for _, perm := range perms {
		if perm == 100 {
			// Initiator has permission to add
			epicCfg.DB.InsertEpicMember(r.Context(), database.InsertEpicMemberParams{
				EpicMembersEpicID: params.EpicId,
				UsersEmail:        params.UserEmail,
			})
		}
	}
}

// Delete Member from an EPIC
// Add member to an EPIC
func (epicCfg *EpicConfig) DeleteMemberFromEpic(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	type parameters struct {
		EpicId    uuid.UUID `json:"epic_id"`
		UserEmail string    `json:"user_email"`
	}

	json := json.NewDecoder(r.Body)
	params := parameters{}
	err := json.Decode(&params)

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	perms, err := service.FetchEpicPermissions(params.EpicId, user.Id, epicCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	// Fetch ID of user who is going to be deleted
	id, err := epicCfg.DB.GetIDFromEmail(r.Context(), params.UserEmail)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	if id == user.Id {
		utils.RespondWithError(w, http.StatusBadRequest, "Cannot Delete Self")
		return
	}

	// Checking whether the Initiator has permission to remove user from epic
	for _, perm := range perms {
		if perm == 101 {
			// Remove From epic_members table
			err := epicCfg.DB.RemoveMember(r.Context(), database.RemoveMemberParams{
				EpicMembersEpicID: params.EpicId,
				EpicMembersUserID: id,
			})
			if err != nil {
				log.Printf("Cannot Remove Member %v executed by %v : %v", id, user.Email, err)
				utils.RespondWithError(w, http.StatusInternalServerError, "Server Error")
				return
			}

			// Remove From task_assignemnt table
			err = epicCfg.DB.DeleteUserFromAllTask(r.Context(), id)
			if err != nil {
				log.Printf("Cannot Remove Member %v executed by %v : %v", id, user.Email, err)
				utils.RespondWithError(w, http.StatusInternalServerError, "Server Error")
				return
			}

			//Remove from epic_assignment table
			err = epicCfg.DB.DeleteUserFromEpic(r.Context(), id)
			if err != nil {
				log.Printf("Cannot Remove Member %v executed by %v : %v", id, user.Email, err)
				utils.RespondWithError(w, http.StatusInternalServerError, "Server Error")
				return
			}

			utils.RespondWithJSON(w, http.StatusAccepted, "Success")
			return
		}
	}

	utils.RespondWithError(w, http.StatusForbidden, "No permission")
	return
}

func (epicCfg *EpicConfig) DeleteEpic(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	// Allow only MASTERS to create EPIC
	role := strings.ToUpper(user.Role)
	if role != "MASTER" {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Not Authorized to create EPIC")
	}

	// Input from user to Update an EPIC
	type parameters struct {
		EpicID uuid.UUID `json:"epic_id"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		log.Print(err)
		utils.RespondWithError(w, 400, "Invalid Input")
		return
	}

	// Make sure EPIC_ID is present
	if params.EpicID == uuid.Nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Epic Value not given")
		return
	}

	// Get Epic from DB
	epic, err := epicCfg.DB.GetEpicFromEpicID(r.Context(), params.EpicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "No EPIC found")
		return
	}

	// Check whether the user is the owner of the EPIC
	if user.Id != epic.EpicOwner {
		utils.RespondWithError(w, http.StatusUnauthorized, "Only Owner can update EPIC")
		return
	}

	err = epicCfg.DB.DeleteEpic(r.Context(), params.EpicID)
	if err != nil {
		log.Printf("Cannot Delete Epic %v from DB by User %v : %v", params.EpicID, user.Email, err.Error())
		utils.RespondWithError(w, http.StatusInternalServerError, "Server Error")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, nil)
}

// Get EPIC to which user belongs
func (epicCfg *EpicConfig) GetUserEpics(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	epics, err := epicCfg.DB.GetEpicsOfUser(r.Context(), user.Id)

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Could not get Epics: %v", err))
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, epics)
}

// Get EPIC detail
// Only the member of the EPIC can access
func (epicCfg *EpicConfig) GetFullEpic(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	epicID := chi.URLParam(r, "id")

	parsedEpicID, err := uuid.Parse(epicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Malformed ID")
	}

	epic, err := epicCfg.DB.GetEpic(r.Context(), database.GetEpicParams{
		EpicMembersUserID: user.Id,
		EpicID:            parsedEpicID,
	})

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Could not get Epic Date: %v", err))
		return
	}

	utils.RespondWithJSON(w, http.StatusAccepted, epic)
}

// Get Permissions in EPIC
func (epicConfig *EpicConfig) GetEpicPermissions(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	epicID := chi.URLParam(r, "id")

	parsedEpicID, err := uuid.Parse(epicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Malformed ID")
	}

	perms, err := service.FetchEpicPermissions(parsedEpicID, user.Id, epicConfig.DB, r.Context())

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Data Does not exist")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, perms)
	return
}
