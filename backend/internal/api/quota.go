package api

import (
	"net/http"

	"Document-Converter-Server/internal/auth"
	"Document-Converter-Server/internal/ratelimit"
)

func RegisterQuotaRoutes(mux *http.ServeMux, authService *auth.AuthService, rateLimiter *ratelimit.RateLimiter) {
	mux.HandleFunc("/api/user/quota", withCORS(authService.RequireAuth(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		userID := auth.UserIDFromContext(r.Context())
		_, quota, err := rateLimiter.CheckRateLimit(userID)
		if err != nil {
			http.Error(w, "failed to get quota", http.StatusInternalServerError)
			return
		}

		response := rateLimiter.GetQuotaResponse(quota)
		writeJSON(w, http.StatusOK, response)
	})))
}
