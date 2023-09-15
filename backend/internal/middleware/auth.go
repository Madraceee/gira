package middleware

import (
	"fmt"
	"log"
	"net/http"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/common"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/utils"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type authHandler func(http.ResponseWriter, *http.Request, common.UserData)

func MiddlewareAuth(handler authHandler, db *database.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		signed_token, err := utils.GetAPIKey(r.Header)
		if err != nil {
			utils.RespondWithError(w, 403, fmt.Sprintf("Header Error: %v", err))
			return
		}

		token, err := jwt.Parse(signed_token, func(token *jwt.Token) (interface{}, error) {
			return []byte("test"), nil
		})

		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				utils.RespondWithError(w, 401, "Wrong Authorization token")
				return
			}
			utils.RespondWithError(w, http.StatusBadRequest, "Wrong Authorization token")
			return
		}

		if token.Valid {

			claims, err := token.Claims.(jwt.MapClaims)

			var usrData common.UserData

			var userID string
			if err && token.Valid {
				userID = claims["id"].(string)
				usrData.Email = claims["email"].(string)
				usrData.Id, _ = uuid.Parse(userID)
				usrData.Role = claims["role"].(string)
			}

			_, dbErr := db.GetUserToken(r.Context(), usrData.Id)
			if dbErr != nil {
				if dbErr.Error() != "sql: no rows in result set" {
					log.Printf("Error while fetching user_auth %v", err)
					utils.RespondWithError(w, 500, "Server Error")
					return
				}
			}
			if dbErr != nil {
				if dbErr.Error() == "sql: no rows in result set" {
					utils.RespondWithError(w, 401, "Session Time out")
					return
				}
			}

			handler(w, r, usrData)
			return
		}
	}
}
