package api

import (
	"encoding/json"
	"net/http"

	"Document-Converter-Server/internal/auth"
)

func RegisterAuthRoutes(mux *http.ServeMux, authService *auth.AuthService) {
	mux.HandleFunc("/api/auth/register", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		user, token, err := authService.RegisterUser(req.Email, req.Password)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		writeJSON(w, http.StatusCreated, map[string]any{
			"user":  map[string]any{"id": user.ID, "email": user.Email},
			"token": token,
		})
	}))

	mux.HandleFunc("/api/auth/login", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		user, token, err := authService.LoginUser(req.Email, req.Password)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{
			"user":  map[string]any{"id": user.ID, "email": user.Email},
			"token": token,
		})
	}))

	mux.HandleFunc("/api/auth/me", withCORS(authService.RequireAuth(func(w http.ResponseWriter, r *http.Request) {
		userID := auth.UserIDFromContext(r.Context())
		user, err := authService.FindUserByID(userID)
		if err != nil {
			http.Error(w, "user not found", http.StatusNotFound)
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"id": user.ID, "email": user.Email})
	})))
}
