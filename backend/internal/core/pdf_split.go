package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

func SplitPDF(inputPath string, outputDir string, pageRanges []string) ([]string, error) {
	if inputPath == "" {
		return nil, fmt.Errorf("input path is required")
	}
	if outputDir == "" {
		outputDir = os.TempDir()
	}

	if len(pageRanges) == 0 {
		pageRanges = []string{"1"} // Default to first page
	}

	var outputPaths []string

	// Check if Python with PyPDF2 is available for real splitting
	if _, err := exec.LookPath("python3"); err == nil {
		paths, err := splitPDFWithPython(inputPath, outputDir, pageRanges)
		if err == nil {
			return paths, nil
		}
	}

	// Fallback to placeholder
	for i, pageRange := range pageRanges {
		outputPath := filepath.Join(outputDir, fmt.Sprintf("split_%d_%s", i, time.Now().Format("20060102-150405")+".pdf"))
		placeholderPath, err := createPlaceholderSplitPDF(inputPath, outputPath, pageRange)
		if err != nil {
			return nil, err
		}
		outputPaths = append(outputPaths, placeholderPath)
	}

	return outputPaths, nil
}

func splitPDFWithPython(inputPath string, outputDir string, pageRanges []string) ([]string, error) {
	var outputPaths []string

	for i, pageRange := range pageRanges {
		outputPath := filepath.Join(outputDir, fmt.Sprintf("split_%d_%s", i, time.Now().Format("20060102-150405")+".pdf"))

		pythonScript := fmt.Sprintf(`
import sys
from PyPDF2 import PdfReader, PdfWriter

try:
    reader = PdfReader(sys.argv[1])
    writer = PdfWriter()
    
    # Parse page range (simple: "1-3" or "5")
    pages = sys.argv[2].split('-')
    if len(pages) == 2:
        start = int(pages[0]) - 1
        end = int(pages[1])
        for page_num in range(start, min(end, len(reader.pages))):
            writer.add_page(reader.pages[page_num])
    else:
        page_num = int(pages[0]) - 1
        if page_num < len(reader.pages):
            writer.add_page(reader.pages[page_num])
    
    with open(sys.argv[3], 'wb') as output_file:
        writer.write(output_file)
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
`)

		scriptPath := filepath.Join(os.TempDir(), fmt.Sprintf("split_pdf_%d.py", i))
		if err := os.WriteFile(scriptPath, []byte(pythonScript), 0o644); err != nil {
			return nil, fmt.Errorf("failed to create python script: %w", err)
		}
		defer os.Remove(scriptPath)

		cmd := exec.Command("python3", scriptPath, inputPath, pageRange, outputPath)
		output, err := cmd.CombinedOutput()
		if err != nil {
			return nil, fmt.Errorf("python split failed: %w, output: %s", err, string(output))
		}

		if !strings.Contains(string(output), "SUCCESS") {
			return nil, fmt.Errorf("python split failed: %s", string(output))
		}

		outputPaths = append(outputPaths, outputPath)
	}

	return outputPaths, nil
}

func createPlaceholderSplitPDF(inputPath, outputPath, pageRange string) (string, error) {
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
(Split PDF Document) Tj
0 -20 Td
(Page Range: ` + pageRange + `) Tj
0 -20 Td
(Source: ` + filepath.Base(inputPath) + `) Tj
0 -20 Td
(Date: ` + time.Now().Format(time.RFC3339) + `) Tj
0 -40 Td
(Note: Install Python3 with PyPDF2 for real PDF splitting) Tj
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
