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
		EpicMembersUserID: user.Id,
	})

	// Create Roles
	// Master Role for EPIC(access to everything)
	epicRole, err := epicCfg.DB.CreateMasterEpicRole(r.Context(), database.CreateMasterEpicRoleParams{
		RoleEpicID: epic.EpicID,
		RoleName:   "MASTER",
	})

	// Assigning Permissions to MASTER
	permissions := []int{100, 101, 102, 103, 104, 105, 106}
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

func (epicCfg *EpicConfig) UpdateEpic(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	// Allow only MASTERS to create EPIC
	role := strings.ToUpper(user.Role)
	if role != "MASTER" {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Not Authorized to create EPIC")
	}

	// Input from user to Update an EPIC
	type parameters struct {
		EpicID      uuid.UUID `json:"epic_id"`
		Description string    `json:"desc"`
		Features    string    `json:"features"`
		End_date    time.Time `json:"end_date"`
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

	// Insert the updated values only
	if params.Description == "" {
		params.Description = epic.EpicDescription
	}
	if params.Features == "" {
		params.Features = epic.EpicFeatures
	}

	var inputEndTime sql.NullTime
	if params.End_date.IsZero() {
		inputEndTime.Time = epic.EpicEndDate.Time
		inputEndTime.Valid = epic.EpicEndDate.Valid
	} else {
		inputEndTime.Time = params.End_date
		inputEndTime.Valid = true
	}

	err = epicCfg.DB.UpdateEpic(r.Context(), database.UpdateEpicParams{
		EpicID:          epic.EpicID,
		EpicDescription: params.Description,
		EpicFeatures:    params.Features,
		EpicEndDate:     inputEndTime,
	})

	if err != nil {
		log.Printf("Error while updating EPIC %v : %v", user.Email, err.Error())
		utils.RespondWithError(w, http.StatusBadRequest, "Input Error")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, nil)
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
