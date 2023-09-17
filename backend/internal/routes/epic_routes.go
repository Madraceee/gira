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

	r.Post("/epic/createEpic", middleware.MiddlewareAuth(epicApi.CreateEpic, epicApi.DB))
	r.Delete("/epic/deleteEpic", middleware.MiddlewareAuth(epicApi.DeleteEpic, epicApi.DB))
	r.Get("/epic/getUserEpics", middleware.MiddlewareAuth(epicApi.GetUserEpics, epicApi.DB))
	r.Get("/epic/getEpic/{id}", middleware.MiddlewareAuth(epicApi.GetFullEpic, epicApi.DB))
	r.Get("/epic/getEpicPerms/{id}", middleware.MiddlewareAuth(epicApi.GetEpicPermissions, epicApi.DB))
	r.Post("/epic/addMember", middleware.MiddlewareAuth(epicApi.AddMemberToEpic, epicApi.DB))
	r.Delete("/epic/deleteMember", middleware.MiddlewareAuth(epicApi.DeleteMemberFromEpic, epicApi.DB))
}
