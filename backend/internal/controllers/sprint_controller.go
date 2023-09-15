package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/common"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/utils"
	"github.com/google/uuid"
)

type SprintConfig struct {
	DB *database.Queries
}

func (sprintCfg *SprintConfig) CreateSprint(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	// Allow only MASTERS to create SPRINT
	role := strings.ToUpper(user.Role)
	if role != "MASTER" {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Not Authorized to create SPRINT")
	}

	// Input from user to create an SPRINT
	type parameters struct {
		EpicID     uuid.UUID `json:"epic_id"`
		Start_date time.Time `json:"start_date"`
		End_date   time.Time `json:"end_date"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, 400, "Invalid Input")
		return
	}

	// Frontend should ensure the fields are set properly else empty string will be created.
	sprint, err := sprintCfg.DB.CreateSprint(r.Context(), database.CreateSprintParams{
		SprintEpicID:    params.EpicID,
		SprintStartDate: params.Start_date,
		SprintEndDate:   params.End_date,
	})

	if err != nil {
		log.Printf("Error while inserting into DB by %v : %v", user.Email, err.Error())
		utils.RespondWithError(w, http.StatusBadRequest, "Input Error")
		return
	}

	utils.RespondWithJSON(w, 200, sprint)
}

func (sprintCfg *SprintConfig) UpdateSprint(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	// Allow only MASTERS to create SPRINT
	role := strings.ToUpper(user.Role)
	if role != "MASTER" {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Not Authorized to create EPIC")
	}

	// Input from user to Update an SPRINT
	type parameters struct {
		EpicID   uuid.UUID `json:"epic_id"`
		SprintID int       `json:"sprint_id"`
		End_date time.Time `json:"end_date"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		log.Print(err)
		utils.RespondWithError(w, 400, "Invalid Input")
		return
	}

	// Make sure EPIC_ID and SPRINT_ID is present
	if params.EpicID == uuid.Nil || params.SprintID == 0 {
		utils.RespondWithError(w, http.StatusBadRequest, "Epic Value OR Sprint Value not given")
		return
	}

	// Get Epic from DB
	record, err := sprintCfg.DB.GetSprintWithOwner(r.Context(), database.GetSprintWithOwnerParams{
		EpicID:   params.EpicID,
		SprintID: int32(params.SprintID),
	})

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "No Record found")
		return
	}

	// Check whether the user is the owner of the EPIC
	if user.Id != record.EpicOwner {
		utils.RespondWithError(w, http.StatusUnauthorized, "Only Owner can update Sprint")
		return
	}

	sprint, err := sprintCfg.DB.UpdateSprint(r.Context(), database.UpdateSprintParams{
		SprintEpicID:  params.EpicID,
		SprintID:      int32(params.SprintID),
		SprintEndDate: params.End_date,
	})

	if err != nil {
		log.Printf("Error while updating SPRINT By %v : %v", user.Email, err.Error())
		utils.RespondWithError(w, http.StatusBadRequest, "Input Error")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, sprint)
}
