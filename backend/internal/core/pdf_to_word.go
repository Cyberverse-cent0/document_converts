package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

func PdfToWord(inputPath string, outputDir string) (string, error) {
	if inputPath == "" {
		return "", fmt.Errorf("input path is required")
	}
	if outputDir == "" {
		outputDir = os.TempDir()
	}

	outputPath := BuildOutputPath(inputPath, outputDir)

	// Check if LibreOffice is available for real conversion
	if _, err := exec.LookPath("libreoffice"); err == nil {
		return ConvertWithLibreOffice(inputPath, outputDir, "pdf-to-word")
	}

	// Fallback to enhanced placeholder
	return createPlaceholderWordDocument(inputPath, outputPath, "pdf-to-word")
}

func createPlaceholderWordDocument(inputPath, outputPath, mode string) (string, error) {
	if err := os.MkdirAll(filepath.Dir(outputPath), 0o755); err != nil {
		return "", fmt.Errorf("unable to create output directory: %w", err)
	}

	// Create a more realistic placeholder document
	content := `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
<w:p>
<w:pPr>
<w:jc w:val="center"/>
</w:pPr>
<w:r>
<w:rPr>
<w:b/>
<w:sz w:val="28"/>
</w:rPr>
<w:t>Document Conversion</w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:t>This is a placeholder converted document from PDF to Word format.</w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:t>Conversion Mode: ` + mode + `</w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:t>Source File: ` + filepath.Base(inputPath) + `</w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:t>Conversion Date: ` + time.Now().Format(time.RFC3339) + `</w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:rPr>
<w:i/>
</w:rPr>
<w:t>Note: To enable real PDF to Word conversion, install LibreOffice on the server.</w:t>
</w:r>
</w:p>
</w:body>
</w:document>`

	if err := os.WriteFile(outputPath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("failed to write output file: %w", err)
	}

	return outputPath, nil
}
