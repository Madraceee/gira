package controllers

import (
	"database/sql"
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

	if err != nil {
		utils.RespondWithError(w, 500, "Server Error")
		return
	}

	utils.RespondWithJSON(w, 200, epic)
}
