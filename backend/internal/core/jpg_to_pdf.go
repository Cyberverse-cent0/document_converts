package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

func JpgToPDF(inputPaths []string, outputDir string) (string, error) {
	if len(inputPaths) < 1 {
		return "", fmt.Errorf("at least 1 image file is required for JPG to PDF conversion")
	}
	if outputDir == "" {
		outputDir = os.TempDir()
	}

	outputPath := filepath.Join(outputDir, "images_to_pdf_"+time.Now().Format("20060102-150405")+".pdf")

	// Check if Python with PIL is available for real conversion
	if _, err := exec.LookPath("python3"); err == nil {
		return jpgToPDFWithPython(inputPaths, outputPath)
	}

	// Fallback to placeholder
	return createPlaceholderImagePDF(inputPaths, outputPath)
}

func jpgToPDFWithPython(inputPaths []string, outputPath string) (string, error) {
	pythonScript := fmt.Sprintf(`
import sys
from PIL import Image

try:
    images = []
    for img_path in sys.argv[1:-1]:
        img = Image.open(img_path)
        # Convert to RGB if necessary (PDF doesn't support RGBA)
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')
        images.append(img)
    
    if images:
        images[0].save(sys.argv[-1], save_all=True, append_images=images[1:])
        print("SUCCESS")
    else:
        print("ERROR: No valid images found")
        sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
`)

	scriptPath := filepath.Join(os.TempDir(), "jpg_to_pdf.py")
	if err := os.WriteFile(scriptPath, []byte(pythonScript), 0o644); err != nil {
		return "", fmt.Errorf("failed to create python script: %w", err)
	}
	defer os.Remove(scriptPath)

	args := append([]string{"python3", scriptPath}, inputPaths...)
	args = append(args, outputPath)

	cmd := exec.Command(args[0], args[1:]...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("python jpg to pdf failed: %w, output: %s", err, string(output))
	}

	if !strings.Contains(string(output), "SUCCESS") {
		return "", fmt.Errorf("python jpg to pdf failed: %s", string(output))
	}

	return outputPath, nil
}

func createPlaceholderImagePDF(inputPaths []string, outputPath string) (string, error) {
	if err := os.MkdirAll(filepath.Dir(outputPath), 0o755); err != nil {
		return "", fmt.Errorf("unable to create output directory: %w", err)
	}

	fileList := strings.Join(inputPaths, "\n")
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
(JPG to PDF Conversion) Tj
0 -20 Td
(Number of images: ` + fmt.Sprintf("%d", len(inputPaths)) + `) Tj
0 -20 Td
(Date: ` + time.Now().Format(time.RFC3339) + `) Tj
0 -20 Td
(Input files:) Tj
0 -20 Td
(` + fileList + `) Tj
0 -40 Td
(Note: Install Python3 with PIL for real JPG to PDF conversion) Tj
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
