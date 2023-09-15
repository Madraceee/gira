package routes

import (
	"database/sql"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/controllers"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/middleware"
	"github.com/go-chi/chi/v5"
)

func EpicRoute(r *chi.Mux, conn *sql.DB) {

	epicApi := controllers.EpicConfig{
		DB: database.New(conn),
	}

	r.Post("/epic/createEpic",middleware.MiddlewareAuth(epicApi.CreateEpic,epicApi.DB))
}
