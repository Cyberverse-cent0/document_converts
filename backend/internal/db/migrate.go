package db

import (
	"context"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// RunMigrations executes all SQL migration files in the migrations directory
func RunMigrations(migrationsDir string) error {
	if Pool == nil {
		return fmt.Errorf("database pool is not initialized")
	}

	// Read all migration files
	files, err := fs.ReadDir(os.DirFS(migrationsDir), ".")
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %w", err)
	}

	// Sort files by name to ensure correct order
	var migrationFiles []string
	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".sql") {
			migrationFiles = append(migrationFiles, file.Name())
		}
	}
	sort.Strings(migrationFiles)

	// Create migrations table if it doesn't exist
	if err := createMigrationsTable(); err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	// Run each migration
	for _, filename := range migrationFiles {
		if err := runMigration(migrationsDir, filename); err != nil {
			return fmt.Errorf("failed to run migration %s: %w", filename, err)
		}
	}

	log.Printf("Successfully ran %d migrations", len(migrationFiles))
	return nil
}

func createMigrationsTable() error {
	query := `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
	`
	_, err := Pool.Exec(context.Background(), query)
	return err
}

func runMigration(migrationsDir, filename string) error {
	ctx := context.Background()

	// Check if migration has already been applied
	var applied bool
	err := Pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)", filename).Scan(&applied)
	if err != nil {
		return fmt.Errorf("failed to check migration status: %w", err)
	}

	if applied {
		log.Printf("Migration %s already applied, skipping", filename)
		return nil
	}

	// Read migration file
	migrationPath := filepath.Join(migrationsDir, filename)
	content, err := os.ReadFile(migrationPath)
	if err != nil {
		return fmt.Errorf("failed to read migration file: %w", err)
	}

	// Execute migration
	tx, err := Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, string(content)); err != nil {
		return fmt.Errorf("failed to execute migration: %w", err)
	}

	// Record migration as applied
	if _, err := tx.Exec(ctx, "INSERT INTO schema_migrations (version) VALUES ($1)", filename); err != nil {
		return fmt.Errorf("failed to record migration: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	log.Printf("Applied migration: %s", filename)
	return nil
}
