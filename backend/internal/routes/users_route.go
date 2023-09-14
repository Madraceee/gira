package routes

import (
	"database/sql"
	"net/http"

	users "github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/controllers"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/go-chi/chi/v5"
)


func UserRoute (r *chi.Mux, conn *sql.DB){
    
    usrApi := users.UserConfig{
        DB: database.New(conn),
    }


    r.Get("/user/createUser",usrApi.CreateNewUser)
}

func handleTest(w http.ResponseWriter, r *http.Request){
    w.WriteHeader(200)
}
