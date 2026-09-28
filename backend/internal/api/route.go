package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"Document-Converter-Server/internal/auth"
	"Document-Converter-Server/internal/core"
	"Document-Converter-Server/internal/encryption"
	"Document-Converter-Server/internal/ratelimit"
	"Document-Converter-Server/internal/scanner"
	"Document-Converter-Server/internal/sesion"
)

func NewRoute(authService *auth.AuthService) http.Handler {
	mux := http.NewServeMux()
	jobStore := core.NewJobStore()
	rateLimiter := ratelimit.NewRateLimiter()
	fileScanner := scanner.NewScanner()
	keyManager := encryption.NewKeyManager()
	encryptor, err := encryption.NewAESEncryptor(keyManager.GetKey())
	if err != nil {
		panic(fmt.Sprintf("Failed to initialize encryptor: %v", err))
	}
	RegisterRoutes(mux, jobStore, authService, rateLimiter, fileScanner, encryptor)
	return mux
}

func RegisterRoutes(mux *http.ServeMux, jobStore *core.JobStore, authService *auth.AuthService, rateLimiter *ratelimit.RateLimiter, fileScanner *scanner.Scanner, encryptor *encryption.AESEncryptor) {
	RegisterAuthRoutes(mux, authService)
	RegisterQuotaRoutes(mux, authService, rateLimiter)
	RegisterScanRoutes(mux, authService, fileScanner)
	RegisterPDFRoutes(mux, jobStore, authService, rateLimiter, fileScanner, encryptor)
	RegisterAdditionalPDFRoutes(mux, jobStore, authService, rateLimiter, fileScanner, encryptor)

	mux.HandleFunc("/health", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"status": "ok"})
	}))

	mux.HandleFunc("/api/jobs", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		writeJSON(w, http.StatusOK, jobStore.ListJobs())
	}))

	mux.HandleFunc("/api/convert", withCORS(authService.RequireAuth(rateLimiter.Middleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		if err := r.ParseMultipartForm(10 << 20); err != nil {
			http.Error(w, "unable to parse upload: "+err.Error(), http.StatusBadRequest)
			return
		}

		file, header, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "file is required", http.StatusBadRequest)
			return
		}
		defer file.Close()

		if !core.IsSupportedFile(header.Filename) {
			http.Error(w, "unsupported file type", http.StatusUnsupportedMediaType)
			return
		}

		mode := strings.TrimSpace(r.FormValue("mode"))
		if mode == "" {
			mode = "pdf-to-word"
		}
		if !core.IsSupportedMode(mode) {
			http.Error(w, "unsupported conversion mode", http.StatusBadRequest)
			return
		}

		tmpDir, err := os.MkdirTemp("", "document-converter-")
		if err != nil {
			http.Error(w, "unable to create temp folder: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer os.RemoveAll(tmpDir)

		uploadPath := filepath.Join(tmpDir, header.Filename)
		uploaded, err := os.Create(uploadPath)
		if err != nil {
			http.Error(w, "unable to save uploaded file: "+err.Error(), http.StatusInternalServerError)
			return
		}
		if _, err = io.Copy(uploaded, file); err != nil {
			uploaded.Close()
			http.Error(w, "unable to save uploaded content: "+err.Error(), http.StatusInternalServerError)
			return
		}
		uploaded.Close()

		// Scan file for malware and validate
		scanResult, err := fileScanner.ScanFile(uploadPath)
		if err != nil {
			http.Error(w, "file scan failed: "+err.Error(), http.StatusInternalServerError)
			return
		}

		if scanResult.Status != scanner.ScanClean {
			http.Error(w, "file scan failed: "+scanResult.Error, http.StatusBadRequest)
			return
		}

		// Encrypt the uploaded file
		encryptedPath := filepath.Join(tmpDir, "encrypted_"+header.Filename)
		if err := encryptor.EncryptFile(uploadPath, encryptedPath); err != nil {
			http.Error(w, "failed to encrypt file: "+err.Error(), http.StatusInternalServerError)
			return
		}

		job := jobStore.CreateJob(header.Filename, mode, encryptedPath)
		jobStore.UpdateJob(job.ID, core.JobProcessing, "")

		// Decrypt file for conversion (in production, you might want to process encrypted files differently)
		decryptedPath := filepath.Join(tmpDir, "decrypted_"+header.Filename)
		if err := encryptor.DecryptFile(encryptedPath, decryptedPath); err != nil {
			jobStore.UpdateJob(job.ID, core.JobFailed, "")
			http.Error(w, "failed to decrypt file: "+err.Error(), http.StatusInternalServerError)
			return
		}

		outputPath, err := core.ConvertDocument(decryptedPath, tmpDir, mode)
		if err != nil {
			jobStore.UpdateJob(job.ID, core.JobFailed, "")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":       job.ID,
			"status":       "completed",
			"mode":         mode,
			"token":        sesion.GenerateToken(),
			"output_file":  filepath.Base(outputPath),
			"message":      "document conversion requested successfully",
			"scan_status":  scanResult.Status,
			"is_encrypted": true,
		})
	}))))

	mux.HandleFunc("/api/download/", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		jobID := strings.TrimPrefix(r.URL.Path, "/api/download/")
		job, ok := jobStore.GetJob(jobID)
		if !ok || job.OutputPath == "" {
			http.Error(w, "file not found", http.StatusNotFound)
			return
		}

		file, err := os.Open(job.OutputPath)
		if err != nil {
			http.Error(w, "unable to open output file: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer file.Close()

		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%q", filepath.Base(job.OutputPath)))
		w.Header().Set("Content-Type", "application/octet-stream")
		_, _ = io.Copy(w, file)
	}))

	mux.HandleFunc("/", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"service": "document converter", "status": "running"})
	}))
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
