package api

import (
	"net/http"

	"Document-Converter-Server/internal/auth"
	"Document-Converter-Server/internal/scanner"
)

func RegisterScanRoutes(mux *http.ServeMux, authService *auth.AuthService, scanner *scanner.Scanner) {
	mux.HandleFunc("/api/files/scan", withCORS(authService.RequireAuth(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Parse form to get file path
		if err := r.ParseForm(); err != nil {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}

		filePath := r.FormValue("file_path")
		if filePath == "" {
			http.Error(w, "file_path is required", http.StatusBadRequest)
			return
		}

		// Scan the file
		result, err := scanner.ScanFile(filePath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		writeJSON(w, http.StatusOK, result)
	})))
}
