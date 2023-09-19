package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type EnvVars struct {
	PORT   string
	DB_URL string
}

func LoadEnvVal() (*EnvVars, error) {

	godotenv.Load(".env")

	port := os.Getenv("PORT")
	if port == "" {
		return nil, errors.New("PORT not found")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		return nil, errors.New("DB URL is not found")
	}

	return &EnvVars{
		PORT:   port,
		DB_URL: dbURL,
	}, nil
}
