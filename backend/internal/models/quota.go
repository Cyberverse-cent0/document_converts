package models

import (
	"time"
)

type UserQuota struct {
	UserID     int       `json:"user_id"`
	DailyLimit int       `json:"daily_limit"`
	DailyUsed  int       `json:"daily_used"`
	LastReset  time.Time `json:"last_reset"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type QuotaResponse struct {
	DailyLimit     int       `json:"daily_limit"`
	DailyUsed      int       `json:"daily_used"`
	DailyRemaining int       `json:"daily_remaining"`
	LastReset      time.Time `json:"last_reset"`
	ResetIn        string    `json:"reset_in"` // Human-readable time until reset
}
