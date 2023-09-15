package main

import (
	"log"
	"net/http"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/config"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/database"
	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/internal/routes"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

type ApiConfig struct {
	DB *database.Queries
}

func main() {
	// Load env Variables
	env, err := config.LoadEnvVal()
	if err != nil {
		log.Fatalf("Error while fetching env variables : %v", err.Error())
	}
	// Setup Connection to DB
	conn, err := config.GetDatabaseConn(env)
	if err != nil {
		log.Fatalf("Error while getting database connection : %v", err.Error())
	}
	defer conn.Close()

	//Create Server
	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	routes.UserRoute(router, conn)
	routes.AuthRoutes(router, conn)
	routes.EpicRoute(router, conn)
	routes.SprintRoute(router, conn)
	routes.TaskRoute(router, conn)

	srv := &http.Server{
		Handler: router,
		Addr:    ":" + "8080",
	}

	log.Printf("Server starting at port %v", "8080")

	// TLS also available
	err = srv.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

}
