package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/common"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/service"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/utils"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type SprintConfig struct {
	DB *database.Queries
}

// Update RUle
func (sprintCfg *SprintConfig) CreateSprint(w http.ResponseWriter, r *http.Request, user *common.UserData) {

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

	perms, err := service.FetchEpicPermissions(params.EpicID, user.Id, sprintCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	for _, perm := range perms {
		if perm == 104 {
			sprint, err := sprintCfg.DB.CreateSprint(r.Context(), database.CreateSprintParams{
				SprintEpicID:    params.EpicID,
				SprintStartDate: params.Start_date,
				SprintEndDate:   params.End_date,
			})

			if err != nil {
				log.Printf("Error while creating sprint by %v : %v", user.Email, err.Error())
				utils.RespondWithError(w, http.StatusBadRequest, "Input Error")
				return
			}

			utils.RespondWithJSON(w, 200, sprint)
			return
		}
	}

	utils.RespondWithError(w, http.StatusForbidden, "Forbidden")
}

func (sprintCfg *SprintConfig) DeleteSprint(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	type parameters struct {
		SprintID int32     `json:"sprint_id"`
		EpicID   uuid.UUID `json:"epic_id"`
	}

	params := parameters{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid Input")
		return
	}

	perms, err := service.FetchEpicPermissions(params.EpicID, user.Id, sprintCfg.DB, r.Context())
	if err != nil {
		utils.RespondWithError(w, http.StatusForbidden, "No permission")
		return
	}

	isAllowed := false
	for _, perm := range perms {
		if perm == 105 {
			isAllowed = true
			break
		}
	}

	if isAllowed == false {
		utils.RespondWithError(w, http.StatusForbidden, "No permission")
		return
	}

	err = sprintCfg.DB.UpdateTaskSprintStatus(r.Context(), database.UpdateTaskSprintStatusParams{
		TaskEpicID: params.EpicID,
		TaskSprintID: sql.NullInt32{
			Int32: params.SprintID,
			Valid: true,
		},
	})
	if err != nil {
		log.Printf("Cannot delete sprint : %v", err)
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong input")
		return
	}

	err = sprintCfg.DB.DeleteSprint(r.Context(), database.DeleteSprintParams{
		SprintID:     params.SprintID,
		SprintEpicID: params.EpicID,
	})

	if err != nil {
		log.Printf("Cannot delete sprint : %v", err)
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong input")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, "Success")
}

// Get the List of sprint for the EPIC ID
func (sprintCfg *SprintConfig) GetSprints(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	// Only the members should be able to see

	epicID := chi.URLParam(r, "id")

	parsedEpicID, err := uuid.Parse(epicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Malformed ID")
	}

	sprints, err := sprintCfg.DB.GetSprintsOfEpic(r.Context(), database.GetSprintsOfEpicParams{
		EpicMembersEpicID: parsedEpicID,
		EpicMembersUserID: user.Id,
	})

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Could not get Sprints: %v", err))
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, sprints)

}
