package auth

import (
	"context"
	"fmt"
	"sync"
	"time"

	"Document-Converter-Server/internal/db"
	"Document-Converter-Server/internal/models"
)

type UserRepository struct {
	memoryUsers map[string]*models.User
	memoryMutex sync.RWMutex
	nextID      int
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		memoryUsers: make(map[string]*models.User),
		nextID:      1,
	}
}

func (r *UserRepository) Create(email, password string) (*models.User, error) {
	if email == "" {
		return nil, fmt.Errorf("email is required")
	}
	if password == "" {
		return nil, fmt.Errorf("password is required")
	}

	hash, err := HashPassword(password)
	if err != nil {
		return nil, err
	}

	// Try database first if available
	if db.Pool != nil {
		ctx := context.Background()
		now := time.Now()

		var user models.User
		err = db.Pool.QueryRow(ctx, `
			INSERT INTO users (email, password_hash, created_at, updated_at)
			VALUES ($1, $2, $3, $4)
			RETURNING id, email, password_hash, created_at, updated_at
		`, email, hash, now, now).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)

		if err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}

		return &user, nil
	}

	// Fallback to in-memory storage
	r.memoryMutex.Lock()
	defer r.memoryMutex.Unlock()

	// Check if user already exists
	if _, exists := r.memoryUsers[email]; exists {
		return nil, fmt.Errorf("user already exists")
	}

	now := time.Now()
	user := &models.User{
		ID:           r.nextID,
		Email:        email,
		PasswordHash: hash,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	r.memoryUsers[email] = user
	r.nextID++

	return user, nil
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	// Try database first if available
	if db.Pool != nil {
		ctx := context.Background()

		var user models.User
		err := db.Pool.QueryRow(ctx, `
			SELECT id, email, password_hash, created_at, updated_at
			FROM users
			WHERE email = $1
		`, email).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)

		if err != nil {
			return nil, fmt.Errorf("user not found: %w", err)
		}

		return &user, nil
	}

	// Fallback to in-memory storage
	r.memoryMutex.RLock()
	defer r.memoryMutex.RUnlock()

	user, exists := r.memoryUsers[email]
	if !exists {
		return nil, fmt.Errorf("user not found")
	}

	return user, nil
}

func (r *UserRepository) FindByID(id int) (*models.User, error) {
	// Try database first if available
	if db.Pool != nil {
		ctx := context.Background()

		var user models.User
		err := db.Pool.QueryRow(ctx, `
			SELECT id, email, password_hash, created_at, updated_at
			FROM users
			WHERE id = $1
		`, id).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)

		if err != nil {
			return nil, fmt.Errorf("user not found: %w", err)
		}

		return &user, nil
	}

	// Fallback to in-memory storage
	r.memoryMutex.RLock()
	defer r.memoryMutex.RUnlock()

	for _, user := range r.memoryUsers {
		if user.ID == id {
			return user, nil
		}
	}

	return nil, fmt.Errorf("user not found")
}
