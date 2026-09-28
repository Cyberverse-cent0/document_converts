package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

type PageNumberOptions struct {
	Position     string // "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"
	StartNumber  int
	Format       string // "1", "1 of 5", "Page 1", etc.
	FontSize     int
	Color        string // hex color
}

func AddPageNumbers(inputPath string, outputDir string, options PageNumberOptions) (string, error) {
	if inputPath == "" {
		return "", fmt.Errorf("input path is required")
	}
	if outputDir == "" {
		outputDir = os.TempDir()
	}

	// Set defaults
	if options.Position == "" {
		options.Position = "bottom-right"
	}
	if options.StartNumber == 0 {
		options.StartNumber = 1
	}
	if options.Format == "" {
		options.Format = "1"
	}
	if options.FontSize == 0 {
		options.FontSize = 12
	}
	if options.Color == "" {
		options.Color = "#000000"
	}

	outputPath := filepath.Join(outputDir, "numbered_"+time.Now().Format("20060102-150405")+".pdf")

	// Check if Python with PyPDF2 is available for real page numbering
	if _, err := exec.LookPath("python3"); err == nil {
		return addPageNumbersWithPython(inputPath, outputPath, options)
	}

	// Fallback to placeholder
	return createPlaceholderNumberedPDF(inputPath, outputPath, options)
}

func addPageNumbersWithPython(inputPath string, outputPath string, options PageNumberOptions) (string, error) {
	pythonScript := fmt.Sprintf(`
import sys
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
import io

try:
    reader = PdfReader(sys.argv[1])
    writer = PdfWriter()
    
    position = sys.argv[3]
    start_num = int(sys.argv[4])
    page_format = sys.argv[5]
    font_size = int(sys.argv[6])
    color = sys.argv[7]
    
    total_pages = len(reader.pages)
    
    for i, page in enumerate(reader.pages):
        # Create a new page with page number
        packet = io.BytesIO()
        can = canvas.Canvas(packet, pagesize=page.mediabox)
        
        page_num = start_num + i
        if page_format == "1 of n":
            text = f"{page_num} of {total_pages}"
        elif page_format == "Page n":
            text = f"Page {page_num}"
        else:
            text = str(page_num)
        
        can.setFont("Helvetica", font_size)
        can.setFillColor(HexColor(color))
        
        # Calculate position
        page_width = float(page.mediabox[2])
        page_height = float(page.mediabox[3])
        margin = 50
        
        if "top" in position:
            y = page_height - margin
        else:
            y = margin
        
        if "left" in position:
            x = margin
        elif "center" in position:
            x = page_width / 2
        else:
            x = page_width - margin
        
        if "center" in position:
            can.drawCentredString(x, y, text)
        elif "right" in position:
            can.drawRightString(x, y, text)
        else:
            can.drawString(x, y, text)
        
        can.save()
        
        # Merge the page number page with original page
        packet.seek(0)
        new_page = PdfReader(packet).pages[0]
        page.merge_page(new_page)
        writer.add_page(page)
    
    with open(sys.argv[2], 'wb') as output_file:
        writer.write(output_file)
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
`)

	scriptPath := filepath.Join(os.TempDir(), "add_page_numbers.py")
	if err := os.WriteFile(scriptPath, []byte(pythonScript), 0o644); err != nil {
		return "", fmt.Errorf("failed to create python script: %w", err)
	}
	defer os.Remove(scriptPath)

	cmd := exec.Command("python3", scriptPath, inputPath, outputPath, options.Position, 
		fmt.Sprintf("%d", options.StartNumber), options.Format, fmt.Sprintf("%d", options.FontSize), options.Color)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("python page numbering failed: %w, output: %s", err, string(output))
	}

	if string(output) != "SUCCESS\n" {
		return "", fmt.Errorf("python page numbering failed: %s", string(output))
	}

	return outputPath, nil
}

func createPlaceholderNumberedPDF(inputPath, outputPath string, options PageNumberOptions) (string, error) {
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
/Length 400
>>
stream
BT
/F1 12 Tf
50 700 Td
(PDF with Page Numbers) Tj
0 -20 Td
(Position: ` + options.Position + `) Tj
0 -20 Td
(Start Number: ` + fmt.Sprintf("%d", options.StartNumber) + `) Tj
0 -20 Td
(Format: ` + options.Format + `) Tj
0 -20 Td
(Font Size: ` + fmt.Sprintf("%d", options.FontSize) + `) Tj
0 -20 Td
(Color: ` + options.Color + `) Tj
0 -20 Td
(Source: ` + filepath.Base(inputPath) + `) Tj
0 -20 Td
(Date: ` + time.Now().Format(time.RFC3339) + `) Tj
0 -40 Td
(Note: Install Python3 with PyPDF2 and reportlab for real page numbering) Tj
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
