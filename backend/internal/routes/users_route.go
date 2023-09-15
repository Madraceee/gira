package routes

import (
	"database/sql"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/controllers"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/go-chi/chi/v5"
)

func UserRoute(r *chi.Mux, conn *sql.DB) {

	usrApi := controllers.UserConfig{
		DB: database.New(conn),
	}

	r.Post("/user/createUser", usrApi.CreateNewUser)
}
