package ratelimit

import (
	"encoding/json"
	"net/http"
	"strconv"

	"Document-Converter-Server/internal/auth"
)

// Middleware wraps an HTTP handler with rate limiting
func (r *RateLimiter) Middleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// Get user ID from context (set by auth middleware)
		userID := auth.UserIDFromContext(req.Context())
		if userID == 0 {
			// If no user ID, skip rate limiting (shouldn't happen with proper auth)
			next(w, req)
			return
		}

		// Check rate limit
		allowed, quota, err := r.CheckRateLimit(userID)
		if err != nil {
			http.Error(w, "failed to check rate limit", http.StatusInternalServerError)
			return
		}

		if !allowed {
			response := r.GetQuotaResponse(quota)
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("X-RateLimit-Limit", strconv.Itoa(quota.DailyLimit))
			w.Header().Set("X-RateLimit-Remaining", "0")
			w.Header().Set("X-RateLimit-Reset", quota.LastReset.Format(http.TimeFormat))
			w.WriteHeader(http.StatusTooManyRequests)

			errorResponse := map[string]any{
				"error": "rate limit exceeded",
				"quota": response,
			}
			json.NewEncoder(w).Encode(errorResponse)
			return
		}

		// Set rate limit headers
		response := r.GetQuotaResponse(quota)
		w.Header().Set("X-RateLimit-Limit", strconv.Itoa(quota.DailyLimit))
		w.Header().Set("X-RateLimit-Remaining", strconv.Itoa(response.DailyRemaining))
		w.Header().Set("X-RateLimit-Reset", quota.LastReset.Format(http.TimeFormat))

		// Increment usage after successful request
		defer func() {
			if err := r.IncrementUsage(userID); err != nil {
				// Log error but don't fail the request
				// In production, you'd want proper logging here
			}
		}()

		next(w, req)
	}
}
