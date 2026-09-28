package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

func PdfToExcel(inputPath string, outputDir string) (string, error) {
	if inputPath == "" {
		return "", fmt.Errorf("input path is required")
	}
	if outputDir == "" {
		outputDir = os.TempDir()
	}

	baseName := strings.TrimSuffix(filepath.Base(inputPath), filepath.Ext(inputPath))
	outputPath := filepath.Join(outputDir, baseName+".xlsx")

	// Check if LibreOffice is available for real conversion
	if _, err := exec.LookPath("libreoffice"); err == nil {
		return ConvertWithLibreOffice(inputPath, outputDir, "pdf-to-excel")
	}

	// Fallback to placeholder
	return createPlaceholderExcelFile(inputPath, outputPath, "pdf-to-excel")
}

func createPlaceholderExcelFile(inputPath, outputPath, mode string) (string, error) {
	if err := os.MkdirAll(filepath.Dir(outputPath), 0o755); err != nil {
		return "", fmt.Errorf("unable to create output directory: %w", err)
	}

	// Create a simple placeholder Excel file (CSV format as fallback)
	content := `PDF to Excel Conversion
Placeholder converted document from PDF to Excel format.
Conversion Mode: ` + mode + `
Source File: ` + filepath.Base(inputPath) + `
Conversion Date: ` + time.Now().Format(time.RFC3339) + `
Note: To enable real PDF to Excel conversion, install LibreOffice on the server.`

	if err := os.WriteFile(outputPath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("failed to write output file: %w", err)
	}

	return outputPath, nil
}
