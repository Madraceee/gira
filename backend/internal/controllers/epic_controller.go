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

	permissions := []int{100, 101, 102, 103, 104, 105}
	roleId, err := service.CreateEpicRole(epic.EpicID, "MASTER", permissions, epicCfg.DB, r.Context())

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	// Assign Owner to MASTER role
	_, err = epicCfg.DB.AssignUserToEpicPerms(r.Context(), database.AssignUserToEpicPermsParams{
		EpicAssignmentEpicID:  epic.EpicID,
		EpicAssignmentRoleID:  roleId,
		EpicAssignmentUsersID: user.Id,
	})

	// Create Developer and View Role Tasks
	// For Developer
	developerPerms := []int{1, 2, 3, 4, 5}
	_, err = service.CreateTaskRole(epic.EpicID, "Developer", developerPerms, epicCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	viewPerms := []int{1}
	_, err = service.CreateTaskRole(epic.EpicID, "View", viewPerms, epicCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, epic)
}

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

	// Check whether user is active or not
	if active, err := isUserActive(params.UserEmail, epicCfg.DB, r.Context()); err == nil {
		if active == false {
			utils.RespondWithError(w, http.StatusBadRequest, "User account deactive")
			return
		}
	} else {
		utils.RespondWithError(w, http.StatusInternalServerError, "Cannot Fetch User Details")
		return
	}

	//Fetching Permissions of Initiator
	perms, err := service.FetchEpicPermissions(params.EpicId, user.Id, epicCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	// Checking whether the Initiator has permission to add user to epic
	for _, perm := range perms {
		if perm == 100 {
			// Initiator has permission to add
			_, err = epicCfg.DB.InsertEpicMember(r.Context(), database.InsertEpicMemberParams{
				EpicMembersEpicID: params.EpicId,
				UsersEmail:        params.UserEmail,
			})

			if err != nil {
				utils.RespondWithError(w, http.StatusBadRequest, "User does not exist")
				return
			}

			utils.RespondWithJSON(w, http.StatusOK, "Success")
			return
		}
	}

	utils.RespondWithError(w, http.StatusForbidden, "No Permission")
	return

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

	epic, err := epicCfg.DB.GetEpicFromEpicID(r.Context(), params.EpicId)
	if err != nil {
		log.Printf("Cannot fetch Epic: %v", err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	if epic.EpicOwner == id {
		utils.RespondWithError(w, http.StatusForbidden, "Cannot delete epic owner")
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
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Not Authorized to delete EPIC")
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

// Add Epic Role
func (epicCfg *EpicConfig) CreateEpicRole(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	role := strings.ToUpper(user.Role)
	if role != "MASTER" {
		utils.RespondWithError(w, http.StatusForbidden, "Not Authorized")
	}

	type parameter struct {
		EpicID   uuid.UUID `json:"epic_id"`
		RoleName string    `json:"role_name"`
		Perms    []int     `json:"perms"`
	}

	params := parameter{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong Input")
		return
	}

	// Checking whether user is PART of epic, and USER should have MASTER role to add Perms
	_, err = epicCfg.DB.CheckMemberInEpic(r.Context(), database.CheckMemberInEpicParams{
		EpicMembersEpicID: params.EpicID,
		EpicMembersUserID: user.Id,
	})

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "User not Owner of Epic")
		return
	}

	for _, id := range params.Perms {
		if id < 100 || id > 105 {
			utils.RespondWithError(w, http.StatusBadRequest, "Invalid Permissions")
			return
		}
	}

	_, err = service.CreateEpicRole(params.EpicID, params.RoleName, params.Perms, epicCfg.DB, r.Context())
	if err != nil {
		log.Printf("Cannot create Role : %v", err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Cannot create Role")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, "Success")
	return
}

func (epicCfg *EpicConfig) GetAllRolesForEpic(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	epicID := chi.URLParam(r, "epicID")
	parsedEpicID, err := uuid.Parse(epicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong ID")
		return
	}

	roles, err := epicCfg.DB.GetRolesForEpic(r.Context(), parsedEpicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong ID")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, roles)
}

// Assign Epic role to member
func (epicCfg *EpicConfig) AssignMemberEpicRole(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	role := strings.ToUpper(user.Role)
	if role != "MASTER" {
		utils.RespondWithError(w, http.StatusForbidden, "Not Authorized")
	}

	type parameter struct {
		EpicID      uuid.UUID `json:"epic_id"`
		RoleName    string    `json:"role_name"`
		MemberEmail string    `json:"member_email"`
	}

	params := parameter{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong Input")
		return
	}

	// Checking whether user is PART of epic, and USER should have MASTER role to add Perms
	_, err = epicCfg.DB.CheckMemberInEpic(r.Context(), database.CheckMemberInEpicParams{
		EpicMembersEpicID: params.EpicID,
		EpicMembersUserID: user.Id,
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "User not Owner of Epic")
		return
	}

	// Check whether user is active or not
	if active, err := isUserActive(params.MemberEmail, epicCfg.DB, r.Context()); err == nil {
		if active == false {
			utils.RespondWithError(w, http.StatusBadRequest, "User account deactive")
			return
		}
	} else {
		utils.RespondWithError(w, http.StatusInternalServerError, "Cannot Fetch User Details")
		return
	}

	//Check Whether Member is part of Epic
	memberID, err := epicCfg.DB.GetIDFromEmail(r.Context(), params.MemberEmail)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "User does not exist")
		return
	}

	_, err = epicCfg.DB.CheckMemberInEpic(r.Context(), database.CheckMemberInEpicParams{
		EpicMembersEpicID: params.EpicID,
		EpicMembersUserID: memberID,
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "User not part of Epic")
		return
	}

	roleId, err := epicCfg.DB.GetRoleIDFromRoleName(r.Context(), database.GetRoleIDFromRoleNameParams{
		RoleEpicID: params.EpicID,
		RoleName:   params.RoleName,
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong role")
		return
	}

	_, err = epicCfg.DB.AssignUserToEpicPerms(r.Context(), database.AssignUserToEpicPermsParams{
		EpicAssignmentEpicID:  params.EpicID,
		EpicAssignmentRoleID:  roleId,
		EpicAssignmentUsersID: memberID,
	})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Cannot assign Role")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, "Success")
	return
}
