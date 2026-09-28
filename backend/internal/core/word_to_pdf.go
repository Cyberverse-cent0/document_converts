package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

func WordToPDF(inputPath string, outputDir string) (string, error) {
	if inputPath == "" {
		return "", fmt.Errorf("input path is required")
	}
	if outputDir == "" {
		outputDir = os.TempDir()
	}

	baseName := strings.TrimSuffix(filepath.Base(inputPath), filepath.Ext(inputPath))
	outputPath := filepath.Join(outputDir, baseName+".pdf")

	// Check if LibreOffice is available for real conversion
	if _, err := exec.LookPath("libreoffice"); err == nil {
		return ConvertWithLibreOffice(inputPath, outputDir, "word-to-pdf")
	}

	// Fallback to enhanced placeholder
	return createPlaceholderPDFDocument(inputPath, outputPath, "word-to-pdf")
}

func createPlaceholderPDFDocument(inputPath, outputPath, mode string) (string, error) {
	if err := os.MkdirAll(filepath.Dir(outputPath), 0o755); err != nil {
		return "", fmt.Errorf("unable to create output directory: %w", err)
	}

	// Create a basic PDF placeholder (minimal valid PDF)
	content := `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 700 Td
(Document Conversion) Tj
0 -20 Td
(Placeholder PDF from ` + mode + `) Tj
0 -20 Td
(Source: ` + filepath.Base(inputPath) + `) Tj
0 -20 Td
(Date: ` + time.Now().Format(time.RFC3339) + `) Tj
0 -20 Td
(Note: Install LibreOffice for real conversion) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000208 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
399
%%EOF`

	if err := os.WriteFile(outputPath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("failed to write output file: %w", err)
	}

	return outputPath, nil
}
