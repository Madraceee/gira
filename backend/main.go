package main

import (
	"log"
	"net/http"

	"github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/config"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	// Load env Variables
	_, err := config.LoadEnvVal()
	if err != nil {
		log.Fatalf("Error while fetching env variables:%v", err.Error())
	}
	// Setup Connection to DB
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
