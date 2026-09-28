package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort      string
	ServerHost      string
	DatabaseURL     string
	MigrationsDir   string
	JWTSecret       string
	JWTExpiration   string
	EncryptionKey   string
	MaxFileSize     int64
	TempDir         string
	DefaultDailyLimit int
	ClamAVHost      string
	ClamAVPort      string
	CORSOrigins     []string
	LogLevel        string
}

func Load() (*Config, error) {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		// If .env file doesn't exist, use environment variables
	}

	config := &Config{
		ServerPort:      getEnv("SERVER_PORT", "5280"),
		ServerHost:      getEnv("SERVER_HOST", "0.0.0.0"),
		DatabaseURL:     getEnv("DATABASE_URL", "postgres://localhost:5432/document_converter?sslmode=disable"),
		MigrationsDir:   getEnv("MIGRATIONS_DIR", "./internal/db/migrations"),
		JWTSecret:       getEnv("JWT_SECRET", "document-converter-dev-secret"),
		JWTExpiration:   getEnv("JWT_EXPIRATION", "24h"),
		EncryptionKey:   getEnv("ENCRYPTION_KEY", "document-converter-encryption-key-32-chars"),
		MaxFileSize:     getInt64Env("MAX_FILE_SIZE", 52428800), // 50MB
		TempDir:         getEnv("TEMP_DIR", "/tmp/document-converter"),
		DefaultDailyLimit: getIntEnv("DEFAULT_DAILY_LIMIT", 10),
		ClamAVHost:      getEnv("CLAMAV_HOST", "localhost"),
		ClamAVPort:      getEnv("CLAMAV_PORT", "3310"),
		CORSOrigins:     getSliceEnv("CORS_ORIGINS", []string{"http://localhost:3000", "http://localhost:5173"}),
		LogLevel:        getEnv("LOG_LEVEL", "info"),
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getIntEnv(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getInt64Env(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.ParseInt(value, 10, 64); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getSliceEnv(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		// Simple comma-separated parsing
		// In production, you might want more sophisticated parsing
		return []string{value}
	}
	return defaultValue
}
