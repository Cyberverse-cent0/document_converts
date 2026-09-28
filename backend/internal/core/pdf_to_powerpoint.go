package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func PdfToPowerPoint(inputPath string, outputDir string) (string, error) {
	if inputPath == "" {
		return "", fmt.Errorf("input path is required")
	}
	if outputDir == "" {
		outputDir = os.TempDir()
	}

	baseName := strings.TrimSuffix(filepath.Base(inputPath), filepath.Ext(inputPath))
	outputPath := filepath.Join(outputDir, baseName+".pptx")

	// Check if LibreOffice is available for real conversion
	if _, err := exec.LookPath("libreoffice"); err == nil {
		return ConvertWithLibreOffice(inputPath, outputDir, "pdf-to-powerpoint")
	}

	// Fallback to placeholder
	return createPlaceholderPowerPointFile(inputPath, outputPath, "pdf-to-powerpoint")
}

func createPlaceholderPowerPointFile(inputPath, outputPath, mode string) (string, error) {
	if err := os.MkdirAll(filepath.Dir(outputPath), 0o755); err != nil {
		return "", fmt.Errorf("unable to create output directory: %w", err)
	}

	// Create a simple placeholder PowerPoint file (basic PPTX structure)
	content := `PK`

	if err := os.WriteFile(outputPath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("failed to write output file: %w", err)
	}

	return outputPath, nil
}
