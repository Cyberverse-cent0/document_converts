package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func IsSupportedFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".xlsx", ".pptx":
		return true
	default:
		return false
	}
}

func IsSupportedMode(mode string) bool {
	switch strings.ToLower(strings.TrimSpace(mode)) {
	case "", "pdf-to-word", "pdf_to_word", "pdf to word", 
		"word-to-pdf", "word_to_pdf", "word to pdf",
		"merge-pdf", "merge_pdf", "merge pdf",
		"split-pdf", "split_pdf", "split pdf",
		"compress-pdf", "compress_pdf", "compress pdf",
		"rotate-pdf", "rotate_pdf", "rotate pdf",
		"add-page-numbers", "add_page_numbers", "add page numbers",
		"add-watermark", "add_watermark", "add watermark":
		return true
	default:
		return false
	}
}

func BuildOutputPath(inputPath, outputDir string) string {
	if outputDir == "" {
		outputDir = "."
	}
	baseName := strings.TrimSuffix(filepath.Base(inputPath), filepath.Ext(inputPath))
	return filepath.Join(outputDir, baseName+".docx")
}

func ConvertDocument(inputPath, outputDir, mode string) (string, error) {
	if inputPath == "" {
		return "", fmt.Errorf("input path is required")
	}
	if _, err := os.Stat(inputPath); err != nil {
		return "", fmt.Errorf("input file not found: %w", err)
	}

	switch strings.ToLower(strings.TrimSpace(mode)) {
	case "", "pdf-to-word", "pdf_to_word", "pdf to word":
		return PdfToWord(inputPath, outputDir)
	case "word-to-pdf", "word_to_pdf", "word to pdf":
		return WordToPDF(inputPath, outputDir)
	default:
		return "", fmt.Errorf("unsupported conversion mode: %s", mode)
	}
}

func ConvertWithLibreOffice(inputPath, outputDir, mode string) (string, error) {
	// Use LibreOffice for real conversion
	// This requires LibreOffice to be installed on the system
	var outputFormat string
	if mode == "pdf-to-word" {
		outputFormat = "docx"
	} else {
		outputFormat = "pdf"
	}

	cmd := exec.Command("libreoffice", "--headless", "--convert-to", outputFormat, "--outdir", outputDir, inputPath)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("libreoffice conversion failed: %w, output: %s", err, string(output))
	}

	// Find the output file
	baseName := strings.TrimSuffix(filepath.Base(inputPath), filepath.Ext(inputPath))
	outputPath := filepath.Join(outputDir, baseName+"."+outputFormat)

	if _, err := os.Stat(outputPath); err != nil {
		return "", fmt.Errorf("conversion output file not found: %w", err)
	}

	return outputPath, nil
}
