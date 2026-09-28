package main

import (
	"log"
	"net/http"
	"time"

	"Document-Converter-Server/internal/api"
	"Document-Converter-Server/internal/auth"
	"Document-Converter-Server/internal/config"
	"Document-Converter-Server/internal/db"
)

func main() {
	log.Println("Starting application...")

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize database only when it is available. This project supports in-memory
	// auth/job state for local development without a running PostgreSQL instance.
	if err := db.InitDB(); err != nil {
		log.Printf("Database unavailable, continuing in local development mode: %v", err)
	} else {
		defer db.CloseDB()
	}

	// Run migrations only when a database is active.
	if db.Pool != nil {
		if err := db.RunMigrations(cfg.MigrationsDir); err != nil {
			log.Printf("Warning: Failed to run migrations: %v", err)
		}
	}

	authService := auth.NewAuthService(cfg.JWTSecret)
	router := api.NewRoute(authService)
	server := &http.Server{
		Addr:         cfg.ServerHost + ":" + cfg.ServerPort,
		Handler:      router,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("Server is listening on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
