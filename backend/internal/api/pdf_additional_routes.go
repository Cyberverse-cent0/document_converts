package api

import (
	"io"
	"net/http"
	"os"
	"path/filepath"

	"Document-Converter-Server/internal/core"
	"Document-Converter-Server/internal/encryption"
	"Document-Converter-Server/internal/scanner"
)

func RegisterAdditionalPDFRoutes(mux *http.ServeMux, jobStore *core.JobStore, authService interface{}, rateLimiter interface{}, fileScanner *scanner.Scanner, encryptor *encryption.AESEncryptor) {
	// Protect PDF
	mux.HandleFunc("/api/pdf/protect", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		password := r.FormValue("password")
		if password == "" {
			http.Error(w, "password is required", http.StatusBadRequest)
			return
		}

		tmpDir, err := os.MkdirTemp("", "pdf-protect-")
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

		options := core.ProtectOptions{
			Password: password,
			OwnerPassword: r.FormValue("owner_password"),
		}

		outputPath, err := core.ProtectPDF(uploadPath, tmpDir, options)
		if err != nil {
			http.Error(w, "protect failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "protect-pdf", "")
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "PDF protected successfully",
		})
	}))

	// Unlock PDF
	mux.HandleFunc("/api/pdf/unlock", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		password := r.FormValue("password")
		if password == "" {
			http.Error(w, "password is required", http.StatusBadRequest)
			return
		}

		tmpDir, err := os.MkdirTemp("", "pdf-unlock-")
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

		options := core.UnlockOptions{
			Password: password,
		}

		outputPath, err := core.UnlockPDF(uploadPath, tmpDir, options)
		if err != nil {
			http.Error(w, "unlock failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "unlock-pdf", "")
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "PDF unlocked successfully",
		})
	}))

	// Excel to PDF
	mux.HandleFunc("/api/excel/to-pdf", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		tmpDir, err := os.MkdirTemp("", "excel-to-pdf-")
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

		outputPath, err := core.ExcelToPDF(uploadPath, tmpDir)
		if err != nil {
			http.Error(w, "conversion failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "excel-to-pdf", "")
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "Excel converted to PDF successfully",
		})
	}))

	// PowerPoint to PDF
	mux.HandleFunc("/api/powerpoint/to-pdf", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		tmpDir, err := os.MkdirTemp("", "powerpoint-to-pdf-")
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

		outputPath, err := core.PowerPointToPDF(uploadPath, tmpDir)
		if err != nil {
			http.Error(w, "conversion failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "powerpoint-to-pdf", "")
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "PowerPoint converted to PDF successfully",
		})
	}))

	// JPG to PDF
	mux.HandleFunc("/api/jpg/to-pdf", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		if err := r.ParseMultipartForm(50 << 20); err != nil {
			http.Error(w, "unable to parse upload: "+err.Error(), http.StatusBadRequest)
			return
		}

		files := r.MultipartForm.File["files"]
		if len(files) < 1 {
			http.Error(w, "at least 1 file is required", http.StatusBadRequest)
			return
		}

		tmpDir, err := os.MkdirTemp("", "jpg-to-pdf-")
		if err != nil {
			http.Error(w, "unable to create temp folder: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer os.RemoveAll(tmpDir)

		var inputPaths []string
		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err != nil {
				http.Error(w, "unable to open file: "+err.Error(), http.StatusBadRequest)
				return
			}
			defer file.Close()

			if !core.IsSupportedFile(fileHeader.Filename) {
				http.Error(w, "unsupported file type: "+fileHeader.Filename, http.StatusBadRequest)
				return
			}

			uploadPath := filepath.Join(tmpDir, fileHeader.Filename)
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

			inputPaths = append(inputPaths, uploadPath)
		}

		outputPath, err := core.JpgToPDF(inputPaths, tmpDir)
		if err != nil {
			http.Error(w, "conversion failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob("images_to_pdf.pdf", "jpg-to-pdf", "")
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "JPG converted to PDF successfully",
		})
	}))

	// PDF to Excel
	mux.HandleFunc("/api/pdf/to-excel", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		tmpDir, err := os.MkdirTemp("", "pdf-to-excel-")
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

		outputPath, err := core.PdfToExcel(uploadPath, tmpDir)
		if err != nil {
			http.Error(w, "conversion failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "pdf-to-excel", "")
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "PDF converted to Excel successfully",
		})
	}))

	// PDF to JPG
	mux.HandleFunc("/api/pdf/to-jpg", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		tmpDir, err := os.MkdirTemp("", "pdf-to-jpg-")
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

		outputPaths, err := core.PdfToJpg(uploadPath, tmpDir)
		if err != nil {
			http.Error(w, "conversion failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "pdf-to-jpg", "")
		if len(outputPaths) > 0 {
			jobStore.UpdateJob(job.ID, core.JobCompleted, outputPaths[0])
		} else {
			jobStore.UpdateJob(job.ID, core.JobFailed, "")
		}

		outputFiles := make([]string, len(outputPaths))
		for i, path := range outputPaths {
			outputFiles[i] = filepath.Base(path)
		}

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":       job.ID,
			"status":       "completed",
			"output_files": outputFiles,
			"message":      "PDF converted to JPG successfully",
		})
	}))

	// PDF to PowerPoint
	mux.HandleFunc("/api/pdf/to-powerpoint", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		tmpDir, err := os.MkdirTemp("", "pdf-to-powerpoint-")
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

		outputPath, err := core.PdfToPowerPoint(uploadPath, tmpDir)
		if err != nil {
			http.Error(w, "conversion failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "pdf-to-powerpoint", "")
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "PDF converted to PowerPoint successfully",
		})
	}))
}
