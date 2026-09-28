package ratelimit

import (
	"context"
	"fmt"
	"time"

	"Document-Converter-Server/internal/db"
	"Document-Converter-Server/internal/models"
)

type RateLimiter struct{}

func NewRateLimiter() *RateLimiter {
	return &RateLimiter{}
}

// CheckRateLimit checks if a user has exceeded their daily quota
func (r *RateLimiter) CheckRateLimit(userID int) (bool, *models.UserQuota, error) {
	ctx := context.Background()

	// Get or create user quota
	quota, err := r.getOrCreateQuota(ctx, userID)
	if err != nil {
		return false, nil, fmt.Errorf("failed to get quota: %w", err)
	}

	// Check if quota needs to be reset (new day)
	if r.shouldResetQuota(quota) {
		if err := r.resetQuota(ctx, userID); err != nil {
			return false, nil, fmt.Errorf("failed to reset quota: %w", err)
		}
		quota.DailyUsed = 0
		quota.LastReset = time.Now()
	}

	// Check if user has exceeded quota
	hasQuota := quota.DailyUsed < quota.DailyLimit
	return hasQuota, quota, nil
}

// IncrementUsage increments the user's daily usage count
func (r *RateLimiter) IncrementUsage(userID int) error {
	ctx := context.Background()

	query := `
		UPDATE user_quotas
		SET daily_used = daily_used + 1, updated_at = $1
		WHERE user_id = $2
	`
	_, err := db.Pool.Exec(ctx, query, time.Now(), userID)
	if err != nil {
		return fmt.Errorf("failed to increment usage: %w", err)
	}

	return nil
}

func (r *RateLimiter) getOrCreateQuota(ctx context.Context, userID int) (*models.UserQuota, error) {
	// Try to get existing quota
	var quota models.UserQuota
	err := db.Pool.QueryRow(ctx, `
		SELECT user_id, daily_limit, daily_used, last_reset, created_at, updated_at
		FROM user_quotas
		WHERE user_id = $1
	`, userID).Scan(&quota.UserID, &quota.DailyLimit, &quota.DailyUsed, &quota.LastReset, &quota.CreatedAt, &quota.UpdatedAt)

	if err == nil {
		return &quota, nil
	}

	// If quota doesn't exist, create it with default values
	now := time.Now()
	defaultLimit := 10 // Default daily limit

	query := `
		INSERT INTO user_quotas (user_id, daily_limit, daily_used, last_reset, created_at, updated_at)
		VALUES ($1, $2, 0, $3, $4, $5)
		RETURNING user_id, daily_limit, daily_used, last_reset, created_at, updated_at
	`
	err = db.Pool.QueryRow(ctx, query, userID, defaultLimit, now, now, now).
		Scan(&quota.UserID, &quota.DailyLimit, &quota.DailyUsed, &quota.LastReset, &quota.CreatedAt, &quota.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create quota: %w", err)
	}

	return &quota, nil
}

func (r *RateLimiter) shouldResetQuota(quota *models.UserQuota) bool {
	now := time.Now()
	return now.Sub(quota.LastReset) >= 24*time.Hour
}

func (r *RateLimiter) resetQuota(ctx context.Context, userID int) error {
	query := `
		UPDATE user_quotas
		SET daily_used = 0, last_reset = $1, updated_at = $1
		WHERE user_id = $2
	`
	_, err := db.Pool.Exec(ctx, query, time.Now(), userID)
	return err
}

// GetQuotaResponse returns a formatted quota response
func (r *RateLimiter) GetQuotaResponse(quota *models.UserQuota) *models.QuotaResponse {
	remaining := quota.DailyLimit - quota.DailyUsed
	if remaining < 0 {
		remaining = 0
	}

	// Calculate time until reset
	now := time.Now()
	resetIn := 24*time.Hour - now.Sub(quota.LastReset)
	if resetIn < 0 {
		resetIn = 0
	}

	return &models.QuotaResponse{
		DailyLimit:     quota.DailyLimit,
		DailyUsed:      quota.DailyUsed,
		DailyRemaining: remaining,
		LastReset:      quota.LastReset,
		ResetIn:        resetIn.String(),
	}
}
