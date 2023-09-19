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
	r.Get("/task/GetUserTasks/{id}", middleware.MiddlewareAuth(usrApi.FetchUsersTask, usrApi.DB))
	r.Get("/task/getTaskPerms/{taskID}", middleware.MiddlewareAuth(usrApi.FetchTaskPermissions, usrApi.DB))
	r.Patch("/task/updateTaskFull", middleware.MiddlewareAuth(usrApi.UpdateTaskFull, usrApi.DB))
	r.Patch("/task/updateStatus", middleware.MiddlewareAuth(usrApi.UpdateTaskStatus, usrApi.DB))
	r.Get("/task/getRolesForTasks/{epicID}", middleware.MiddlewareAuth(usrApi.GetAllPermsOfTask, usrApi.DB))
	r.Post("/task/addMemberToTask", middleware.MiddlewareAuth(usrApi.AddUserToTask, usrApi.DB))
	r.Delete("/task/deleteMemberFromTask", middleware.MiddlewareAuth(usrApi.DeleteUserFromTask, usrApi.DB))
	r.Post("/task/addTaskRole", middleware.MiddlewareAuth(usrApi.CreateTaskRole, usrApi.DB))
}
