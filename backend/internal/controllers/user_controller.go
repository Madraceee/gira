package users

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/utils"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)



type UserConfig struct {
    DB *database.Queries;
}

func (usrCfg *UserConfig) CreateNewUser(w http.ResponseWriter, r *http.Request){
    type parameters struct{
        Name string `json:name`
        Email string `json:email`
        User_type string `json:user_type`
        Password string `json:password`
    }

    decoder := json.NewDecoder(r.Body)
    params := parameters{}
    err := decoder.Decode(&params)
    if err != nil{
        utils.RespondWithError(w,400,"Invalid Input")
        return
    }
    
    // Check Whether User is present , If so return



    // Encrpt password 
    hashed_password, err := bcrypt.GenerateFromPassword([]byte(params.Password),bcrypt.DefaultCost)
    if err != nil{
        log.Printf("Error generating password hash %v",err.Error())
        utils.RespondWithError(w,500,"Server Error")
        return
    }

    _, err = usrCfg.DB.CreateUser(r.Context(), database.CreateUserParams{
        ID: uuid.New(),
        Name: params.Name,
        Email: params.Email,
        AccountStatus: "ACTIVE",
        UserType: strings.ToUpper(params.User_type),
        Password: string(hashed_password),
    })

    if err != nil {
        utils.RespondWithError(w, 400, fmt.Sprintf("Could not create User: %v", err))
		return
	}

    utils.RespondWithJSON(w,201,nil)
}
