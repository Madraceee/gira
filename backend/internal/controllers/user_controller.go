package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/common"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/utils"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserConfig struct {
	DB *database.Queries
}

func (usrCfg *UserConfig) CreateNewUser(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name      string `json:"name"`
		Email     string `json:"email"`
		User_type string `json:"user_type"`
		Password  string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, 400, "Invalid Input")
		return
	}

	// Check Whether User is present , Return Error
	user, err := usrCfg.DB.Login(r.Context(), params.Email)
	if user.UsersEmail == params.Email && user.UsersAccountStatus == "ACTIVE" {
		utils.RespondWithError(w, 400, "Account Exists")
		return
	}
	if user.UsersEmail == params.Email && user.UsersAccountStatus == "DEACTIVE" {
		err = bcrypt.CompareHashAndPassword([]byte(user.UsersPassword), []byte(params.Password))
		if err != nil {
			utils.RespondWithError(w, http.StatusBadRequest, "Account is deactivated, enter the right password to activate")
			return
		}

		err := usrCfg.DB.ActivateAccount(r.Context(), user.UsersID)
		if err != nil {
			log.Printf("Cannot activate account of %v : %v", user.UsersEmail, err)
			utils.RespondWithError(w, http.StatusInternalServerError, "Cannot Activate Account")
			return
		}
		utils.RespondWithJSON(w, 200, "Deactive Account Activated")
		return
	}

	// Encrpt password
	hashed_password, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error generating password hash %v", err.Error())
		utils.RespondWithError(w, 500, "Server Error")
		return
	}

	_, err = usrCfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		UsersID:            uuid.New(),
		UsersName:          params.Name,
		UsersEmail:         params.Email,
		UsersAccountStatus: "ACTIVE",
		UsersType:          strings.ToUpper(params.User_type),
		UsersPassword:      string(hashed_password),
	})

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Could not create User: %v", err))
		return
	}

	utils.RespondWithJSON(w, http.StatusCreated, "Account Created")
}

// Deactivate Acc
func (usrCfg *UserConfig) DeactivateAccount(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	err := usrCfg.DB.DeactivateAccount(r.Context(), user.Id)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Cannot Deactivate account")
		return
	}

	utils.RespondWithJSON(w, 200, "Account Deactivated")
}
func (usrCfg *UserConfig) DeleteAccount(w http.ResponseWriter, r *http.Request, user *common.UserData) {

	err := usrCfg.DB.DeleteAccount(r.Context(), user.Id)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Cannot Delete account")
		return
	}

	utils.RespondWithJSON(w, 200, "Account Deleted")

}

// Get Epic members/users list
func (usrCfg *UserConfig) GetEpicMembers(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	epicID := chi.URLParam(r, "id")

	parsedEpicID, err := uuid.Parse(epicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Malformed ID")
		return
	}

	_, err = usrCfg.DB.GetEpic(r.Context(), database.GetEpicParams{
		EpicMembersUserID: user.Id,
		EpicID:            parsedEpicID,
	})

	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			utils.RespondWithError(w, http.StatusForbidden, "Must be part of epic")
			return
		}
		log.Printf("Could not get Epic Date: %v", err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not fetch Data")
		return
	}

	members, err := usrCfg.DB.GetEpicMembers(r.Context(), parsedEpicID)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Wonrg Epid ID")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, members)
	return
}
