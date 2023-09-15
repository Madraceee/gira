package routes

import (
	"database/sql"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/controllers"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/middleware"
	"github.com/go-chi/chi/v5"
)

func TaskRoute(r *chi.Mux, conn *sql.DB) {

	usrApi := controllers.TaskConfig{
		DB: database.New(conn),
	}

	r.Post("/task/createTask", middleware.MiddlewareAuth(usrApi.CreateTask, usrApi.DB))
	r.Patch("/task/updateLog", middleware.MiddlewareAuth(usrApi.UpdateTaskLog, usrApi.DB))
	r.Patch("/task/updateLink", middleware.MiddlewareAuth(usrApi.UpdateTaskLink, usrApi.DB))
	r.Patch("/task/updateEndDate", middleware.MiddlewareAuth(usrApi.UpdateTaskEndDate, usrApi.DB))
	r.Patch("/task/updateStatus", middleware.MiddlewareAuth(usrApi.UpdateTaskStatus, usrApi.DB))
	r.Patch("/task/updateSprintID", middleware.MiddlewareAuth(usrApi.UpdateTaskSprintID, usrApi.DB))
}
