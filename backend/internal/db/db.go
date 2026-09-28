package db

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

// InitDB initializes the database connection pool
func InitDB() error {
	if os.Getenv("USE_DATABASE") == "false" || os.Getenv("SKIP_DB") == "true" {
		log.Println("Database disabled by configuration; continuing without PostgreSQL")
		Pool = nil
		return nil
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://localhost:5432/document_converter?sslmode=disable"
	}

	var err error
	Pool, err = pgxpool.New(context.Background(), dbURL)
	if err != nil {
		return fmt.Errorf("unable to create connection pool: %w", err)
	}

	if err := Pool.Ping(context.Background()); err != nil {
		Pool.Close()
		Pool = nil
		return fmt.Errorf("unable to ping database: %w", err)
	}

	log.Println("Database connection established")
	return nil
}

// CloseDB closes the database connection pool
func CloseDB() {
	if Pool != nil {
		Pool.Close()
		log.Println("Database connection closed")
	}
}

// Health checks if the database is accessible
func Health() error {
	if Pool == nil {
		return fmt.Errorf("database pool is not initialized")
	}
	return Pool.Ping(context.Background())
}
