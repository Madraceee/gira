package routes

import (
	"database/sql"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/controllers"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/middleware"
	"github.com/go-chi/chi/v5"
)

func AuthRoutes(r *chi.Mux, conn *sql.DB) {

	usrApi := controllers.AuthConfig{
		DB: database.New(conn),
	}

	r.Post("/user/login", usrApi.Login)
	r.Post("/user/logout", middleware.MiddlewareAuth(usrApi.Logout, usrApi.DB))
}
