package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/common"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/utils"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthConfig struct {
	DB *database.Queries
}

type payload struct {
	Token    string    `json:"token"`
	Email    string    `json:"email"`
	Name     string    `json:"name"`
	Role     string    `json:"role"`
	ID       uuid.UUID `json:"id"`
	ExpireAt time.Time `json:"expire_at"`
}

func (authCfg *AuthConfig) Login(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Extract email and password from body
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, 400, "Invalid Input")
		return
	}

	// Get user from database using email
	// Respond with error if user not found
	user, err := authCfg.DB.Login(r.Context(), params.Email)
	if err != nil {
		utils.RespondWithError(w, 401, "No User Found")
		return
	}

	// Compare the passwords
	// If not matching, return error
	err = bcrypt.CompareHashAndPassword([]byte(user.UsersPassword), []byte(params.Password))
	if err != nil {
		utils.RespondWithError(w, 401, "Wrong Password")
		return
	}

	// Fetch Existing token
	// If no token is available, then generate new token
	user_auth, err := authCfg.DB.GetUserToken(r.Context(), user.UsersID)
	if err != nil {
		if err.Error() != "sql: no rows in result set" {
			log.Printf("Error while fetching user_auth %v", err)
			utils.RespondWithError(w, 500, "Server Error")
			return
		}
	}

	if err == nil {
		utils.RespondWithJSON(w, 200, payload{
			Token:    user_auth.UserAuthToken,
			Email:    user.UsersEmail,
			Name:     user.UsersName,
			Role:     user.UsersType,
			ID:       user.UsersID,
			ExpireAt: user_auth.UserAuthTimestamp.Add(time.Hour),
		})
		return
	}

	// If User token does not exist.
	// Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"id":        user.UsersID.String(),
			"email":     user.UsersEmail,
			"role":      user.UsersType,
			"expire_at": time.Now().Add(time.Hour),
		})

	s, err := token.SignedString([]byte("test"))
	if err != nil {
		log.Printf("Error generating token : %v", err.Error())
		utils.RespondWithError(w, 500, "Server Error")
		return
	}

	// Store user token in DB for later user
	authCfg.DB.InsertUserToken(r.Context(), database.InsertUserTokenParams{
		UserID:            user.UsersID,
		UserAuthToken:     s,
		UserAuthTimestamp: time.Now().Add(time.Hour),
	})

	utils.RespondWithJSON(w, http.StatusOK, payload{
		Token:    s,
		Email:    user.UsersEmail,
		Name:     user.UsersName,
		Role:     user.UsersType,
		ID:       user.UsersID,
		ExpireAt: time.Now().Add(time.Hour),
	})
}

// Logout the user
// Remove the token from DB
func (authCfg *AuthConfig) Logout(w http.ResponseWriter, r *http.Request, user *common.UserData) {
	err := authCfg.DB.DeleteUserToken(r.Context(), user.Id)
	if err != nil {
		utils.RespondWithError(w, 500, "Server errror")
	}

	utils.RespondWithJSON(w, http.StatusOK, "Logged out")
}
