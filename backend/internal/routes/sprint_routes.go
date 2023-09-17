package routes

import (
	"database/sql"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/controllers"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/middleware"
	"github.com/go-chi/chi/v5"
)

func SprintRoute(r *chi.Mux, conn *sql.DB) {

	sprintApi := controllers.SprintConfig{
		DB: database.New(conn),
	}

	r.Post("/sprint/createSprint", middleware.MiddlewareAuth(sprintApi.CreateSprint, sprintApi.DB))
	r.Patch("/sprint/updateSprint", middleware.MiddlewareAuth(sprintApi.UpdateSprint, sprintApi.DB))
	r.Get("/sprint/getSprints/{id}", middleware.MiddlewareAuth(sprintApi.GetSprints, sprintApi.DB))
}
