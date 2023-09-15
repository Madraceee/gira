package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/common"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/utils"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthConfig struct {
	DB *database.Queries
}

type payload struct {
	Token string `json:"token"`
	Email string `json:"email"`
	Name  string `json:"name"`
	Role  string `json:"role"`
}

func (authCfg *AuthConfig) Login(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, 400, "Invalid Input")
		return
	}

	user, err := authCfg.DB.Login(r.Context(), params.Email)
	if err != nil {
		utils.RespondWithError(w, 401, "No User Found")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(params.Password))
	if err != nil {
		utils.RespondWithError(w, 401, "Wrong Password")
		return
	}

	// Fetch Existing token else generate new token
	user_auth, err := authCfg.DB.GetUserToken(r.Context(), user.ID)
	if err != nil {
		if err.Error() != "sql: no rows in result set" {
			log.Printf("Error while fetching user_auth %v", err)
			utils.RespondWithError(w, 500, "Server Error")
		}
	}

	if err == nil {
		utils.RespondWithJSON(w, 200, payload{
			Token: user_auth.Token,
			Email: user.Email,
			Name:  user.Name,
			Role:  user.UserType,
		})
		return
	}

	// Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"id":    user.ID.String(),
			"email": user.Email,
			"role":  user.UserType,
		})

	s, err := token.SignedString([]byte("test"))
	if err != nil {
		log.Printf("Error generating token : %v", err.Error())
		utils.RespondWithError(w, 500, "Server Error")
		return
	}

	authCfg.DB.InsertUserToken(r.Context(), database.InsertUserTokenParams{
		UserID: user.ID,
		Token:  s,
	})

	utils.RespondWithJSON(w, 200, payload{
		Token: s,
		Email: user.Email,
		Name:  user.Name,
		Role:  user.UserType,
	})
}

func (authCfg *AuthConfig) Logout(w http.ResponseWriter, r *http.Request, user common.UserData) {
	err := authCfg.DB.DeleteUserToken(r.Context(), user.Id)
	if err != nil {
		utils.RespondWithError(w, 500, "Server errror")
	}

	utils.RespondWithJSON(w, 200, "Logged out")
}
