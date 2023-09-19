package routes

import (
	"database/sql"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/controllers"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/middleware"
	"github.com/go-chi/chi/v5"
)

func TaskRoute(r *chi.Mux, conn *sql.DB) {

	taskApi := controllers.TaskConfig{
		DB: database.New(conn),
	}

	r.Post("/task/createTask", middleware.MiddlewareAuth(taskApi.CreateTask, taskApi.DB))
	r.Get("/task/GetUserTasks/{id}", middleware.MiddlewareAuth(taskApi.FetchUsersTask, taskApi.DB))
	r.Get("/task/getTaskPerms/{taskID}", middleware.MiddlewareAuth(taskApi.FetchTaskPermissions, taskApi.DB))
	r.Patch("/task/updateTaskFull", middleware.MiddlewareAuth(taskApi.UpdateTaskFull, taskApi.DB))
	r.Patch("/task/updateStatus", middleware.MiddlewareAuth(taskApi.UpdateTaskStatus, taskApi.DB))
	r.Get("/task/getRolesForTasks/{epicID}", middleware.MiddlewareAuth(taskApi.GetAllPermsOfTask, taskApi.DB))
	r.Post("/task/addMemberToTask", middleware.MiddlewareAuth(taskApi.AddUserToTask, taskApi.DB))
	r.Delete("/task/deleteMemberFromTask", middleware.MiddlewareAuth(taskApi.DeleteUserFromTask, taskApi.DB))
	r.Post("/task/addTaskRole", middleware.MiddlewareAuth(taskApi.CreateTaskRole, taskApi.DB))
	r.Get("/task/getMembersOfTask/{taskID}", middleware.MiddlewareAuth(taskApi.GetMembersOfTask, taskApi.DB))
}
