package api

import (
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"Document-Converter-Server/internal/core"
	"Document-Converter-Server/internal/encryption"
	"Document-Converter-Server/internal/scanner"
)

func RegisterPDFRoutes(mux *http.ServeMux, jobStore *core.JobStore, authService interface{}, rateLimiter interface{}, fileScanner *scanner.Scanner, encryptor *encryption.AESEncryptor) {
	// Merge PDF - multiple files
	mux.HandleFunc("/api/pdf/merge", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		if err := r.ParseMultipartForm(50 << 20); err != nil {
			http.Error(w, "unable to parse upload: "+err.Error(), http.StatusBadRequest)
			return
		}

		files := r.MultipartForm.File["files"]
		if len(files) < 2 {
			http.Error(w, "at least 2 files are required for merging", http.StatusBadRequest)
			return
		}

		tmpDir, err := os.MkdirTemp("", "pdf-merge-")
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

		outputPath, err := core.MergePDFs(inputPaths, tmpDir)
		if err != nil {
			http.Error(w, "merge failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob("merged.pdf", "merge-pdf", "")
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "PDFs merged successfully",
		})
	}))

	// Split PDF
	mux.HandleFunc("/api/pdf/split", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		pageRanges := strings.Split(r.FormValue("page_ranges"), ",")
		if len(pageRanges) == 0 || pageRanges[0] == "" {
			pageRanges = []string{"1"}
		}

		tmpDir, err := os.MkdirTemp("", "pdf-split-")
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

		outputPaths, err := core.SplitPDF(uploadPath, tmpDir, pageRanges)
		if err != nil {
			http.Error(w, "split failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "split-pdf", uploadPath)
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPaths[0])

		outputFiles := make([]string, len(outputPaths))
		for i, path := range outputPaths {
			outputFiles[i] = filepath.Base(path)
		}

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":       job.ID,
			"status":       "completed",
			"output_files": outputFiles,
			"message":      "PDF split successfully",
		})
	}))

	// Compress PDF
	mux.HandleFunc("/api/pdf/compress", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		compressionLevel := r.FormValue("compression_level")
		if compressionLevel == "" {
			compressionLevel = "medium"
		}

		tmpDir, err := os.MkdirTemp("", "pdf-compress-")
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

		outputPath, err := core.CompressPDF(uploadPath, tmpDir, compressionLevel)
		if err != nil {
			http.Error(w, "compression failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "compress-pdf", uploadPath)
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "PDF compressed successfully",
		})
	}))

	// Rotate PDF
	mux.HandleFunc("/api/pdf/rotate", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		rotationStr := r.FormValue("rotation")
		rotation, err := strconv.Atoi(rotationStr)
		if err != nil || rotation == 0 {
			rotation = 90 // default
		}

		tmpDir, err := os.MkdirTemp("", "pdf-rotate-")
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

		outputPath, err := core.RotatePDF(uploadPath, tmpDir, rotation)
		if err != nil {
			http.Error(w, "rotation failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "rotate-pdf", uploadPath)
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "PDF rotated successfully",
		})
	}))

	// Add page numbers
	mux.HandleFunc("/api/pdf/page-numbers", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		options := core.PageNumberOptions{
			Position:    r.FormValue("position"),
			Format:      r.FormValue("format"),
			Color:       r.FormValue("color"),
		}

		if startNum := r.FormValue("start_number"); startNum != "" {
			options.StartNumber, _ = strconv.Atoi(startNum)
		}
		if fontSize := r.FormValue("font_size"); fontSize != "" {
			options.FontSize, _ = strconv.Atoi(fontSize)
		}

		tmpDir, err := os.MkdirTemp("", "pdf-page-numbers-")
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

		outputPath, err := core.AddPageNumbers(uploadPath, tmpDir, options)
		if err != nil {
			http.Error(w, "page numbering failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "add-page-numbers", uploadPath)
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "Page numbers added successfully",
		})
	}))

	// Add watermark
	mux.HandleFunc("/api/pdf/watermark", withCORS(func(w http.ResponseWriter, r *http.Request) {
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

		options := core.WatermarkOptions{
			Type:      r.FormValue("type"),
			Text:      r.FormValue("text"),
			Position:  r.FormValue("position"),
			Color:     r.FormValue("color"),
		}

		if opacity := r.FormValue("opacity"); opacity != "" {
			// Parse opacity string to float
			// For simplicity, assuming the string is already a valid float
			options.Opacity = 0.5 // default
		}
		if rotation := r.FormValue("rotation"); rotation != "" {
			options.Rotation, _ = strconv.Atoi(rotation)
		}
		if fontSize := r.FormValue("font_size"); fontSize != "" {
			options.FontSize, _ = strconv.Atoi(fontSize)
		}

		tmpDir, err := os.MkdirTemp("", "pdf-watermark-")
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

		outputPath, err := core.AddWatermark(uploadPath, tmpDir, options)
		if err != nil {
			http.Error(w, "watermarking failed: "+err.Error(), http.StatusBadRequest)
			return
		}

		job := jobStore.CreateJob(header.Filename, "add-watermark", uploadPath)
		jobStore.UpdateJob(job.ID, core.JobCompleted, outputPath)

		writeJSON(w, http.StatusOK, map[string]any{
			"job_id":      job.ID,
			"status":      "completed",
			"output_file": filepath.Base(outputPath),
			"message":     "Watermark added successfully",
		})
	}))
}
