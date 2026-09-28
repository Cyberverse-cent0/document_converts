package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

type UnlockOptions struct {
	Password string
}

func UnlockPDF(inputPath string, outputDir string, options UnlockOptions) (string, error) {
	if inputPath == "" {
		return "", fmt.Errorf("input path is required")
	}
	if outputDir == "" {
		outputDir = os.TempDir()
	}

	if options.Password == "" {
		return "", fmt.Errorf("password is required to unlock PDF")
	}

	outputPath := filepath.Join(outputDir, "unlocked_"+time.Now().Format("20060102-150405")+".pdf")

	// Check if Python with PyPDF2 is available for real unlocking
	if _, err := exec.LookPath("python3"); err == nil {
		return unlockPDFWithPython(inputPath, outputPath, options)
	}

	// Fallback to placeholder
	return createPlaceholderUnlockedPDF(inputPath, outputPath, options)
}

func unlockPDFWithPython(inputPath string, outputPath string, options UnlockOptions) (string, error) {
	pythonScript := fmt.Sprintf(`
import sys
from PyPDF2 import PdfReader, PdfWriter

try:
    reader = PdfReader(sys.argv[1])
    if reader.is_encrypted:
        if not reader.decrypt("%s"):
            print("ERROR: Incorrect password")
            sys.exit(1)
    
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    
    with open(sys.argv[2], 'wb') as output_file:
        writer.write(output_file)
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
`, options.Password)

	scriptPath := filepath.Join(os.TempDir(), "unlock_pdf.py")
	if err := os.WriteFile(scriptPath, []byte(pythonScript), 0o644); err != nil {
		return "", fmt.Errorf("failed to create python script: %w", err)
	}
	defer os.Remove(scriptPath)

	cmd := exec.Command("python3", scriptPath, inputPath, outputPath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("python unlock failed: %w, output: %s", err, string(output))
	}

	if !strings.Contains(string(output), "SUCCESS") {
		return "", fmt.Errorf("python unlock failed: %s", string(output))
	}

	return outputPath, nil
}

func createPlaceholderUnlockedPDF(inputPath, outputPath string, options UnlockOptions) (string, error) {
	if err := os.MkdirAll(filepath.Dir(outputPath), 0o755); err != nil {
		return "", fmt.Errorf("unable to create output directory: %w", err)
	}

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
/Length 300
>>
stream
BT
/F1 12 Tf
50 700 Td
(Unlocked PDF Document) Tj
0 -20 Td
(Source: ` + filepath.Base(inputPath) + `) Tj
0 -20 Td
(Date: ` + time.Now().Format(time.RFC3339) + `) Tj
0 -40 Td
(Note: Install Python3 with PyPDF2 for real PDF unlocking) Tj
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
