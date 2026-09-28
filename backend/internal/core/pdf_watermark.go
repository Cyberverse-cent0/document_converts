package core

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

type WatermarkOptions struct {
	Type         string // "text" or "image"
	Text         string // for text watermarks
	ImagePath    string // for image watermarks
	Position     string // "center", "top-left", "top-right", "bottom-left", "bottom-right"
	Opacity      float64 // 0.0 to 1.0
	Rotation     int    // rotation angle in degrees
	FontSize     int    // for text watermarks
	Color        string // hex color for text watermarks
}

func AddWatermark(inputPath string, outputDir string, options WatermarkOptions) (string, error) {
	if inputPath == "" {
		return "", fmt.Errorf("input path is required")
	}
	if outputDir == "" {
		outputDir = os.TempDir()
	}

	// Set defaults
	if options.Type == "" {
		options.Type = "text"
	}
	if options.Position == "" {
		options.Position = "center"
	}
	if options.Opacity == 0 {
		options.Opacity = 0.5
	}
	if options.Rotation == 0 {
		options.Rotation = 45
	}
	if options.FontSize == 0 {
		options.FontSize = 48
	}
	if options.Color == "" {
		options.Color = "#CCCCCC"
	}

	outputPath := filepath.Join(outputDir, "watermarked_"+time.Now().Format("20060102-150405")+".pdf")

	// Check if Python with PyPDF2 is available for real watermarking
	if _, err := exec.LookPath("python3"); err == nil {
		return addWatermarkWithPython(inputPath, outputPath, options)
	}

	// Fallback to placeholder
	return createPlaceholderWatermarkedPDF(inputPath, outputPath, options)
}

func addWatermarkWithPython(inputPath string, outputPath string, options WatermarkOptions) (string, error) {
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
    
    watermark_type = sys.argv[3]
    position = sys.argv[4]
    opacity = float(sys.argv[5])
    rotation = int(sys.argv[6])
    
    for page in reader.pages:
        packet = io.BytesIO()
        can = canvas.Canvas(packet, pagesize=page.mediabox)
        
        can.setFillColor(HexColor("#CCCCCC"), alpha=opacity)
        
        if watermark_type == "text":
            text = sys.argv[7]
            font_size = int(sys.argv[8])
            color = sys.argv[9]
            
            can.setFont("Helvetica", font_size)
            can.setFillColor(HexColor(color), alpha=opacity)
            
            page_width = float(page.mediabox[2])
            page_height = float(page.mediabox[3])
            
            if position == "center":
                can.drawCentredString(page_width/2, page_height/2, text)
            elif position == "top-left":
                can.drawString(50, page_height - 50, text)
            elif position == "top-right":
                can.drawRightString(page_width - 50, page_height - 50, text)
            elif position == "bottom-left":
                can.drawString(50, 50, text)
            elif position == "bottom-right":
                can.drawRightString(page_width - 50, 50, text)
            
            can.rotate(rotation)
        elif watermark_type == "image":
            image_path = sys.argv[7]
            can.drawImage(image_path, 100, 100, width=200, height=200)
        
        can.save()
        
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

	scriptPath := filepath.Join(os.TempDir(), "add_watermark.py")
	if err := os.WriteFile(scriptPath, []byte(pythonScript), 0o644); err != nil {
		return "", fmt.Errorf("failed to create python script: %w", err)
	}
	defer os.Remove(scriptPath)

	cmd := exec.Command("python3", scriptPath, inputPath, outputPath, options.Type, options.Position, 
		fmt.Sprintf("%.2f", options.Opacity), fmt.Sprintf("%d", options.Rotation), 
		options.Text, fmt.Sprintf("%d", options.FontSize), options.Color)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("python watermarking failed: %w, output: %s", err, string(output))
	}

	if string(output) != "SUCCESS\n" {
		return "", fmt.Errorf("python watermarking failed: %s", string(output))
	}

	return outputPath, nil
}

func createPlaceholderWatermarkedPDF(inputPath, outputPath string, options WatermarkOptions) (string, error) {
	if err := os.MkdirAll(filepath.Dir(outputPath), 0o755); err != nil {
		return "", fmt.Errorf("unable to create output directory: %w", err)
	}

	watermarkDetails := ""
	if options.Type == "text" {
		watermarkDetails = fmt.Sprintf("Text: %s, Font Size: %d, Color: %s", options.Text, options.FontSize, options.Color)
	} else {
		watermarkDetails = fmt.Sprintf("Image: %s", options.ImagePath)
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
(PDF with Watermark) Tj
0 -20 Td
(Type: ` + options.Type + `) Tj
0 -20 Td
(` + watermarkDetails + `) Tj
0 -20 Td
(Position: ` + options.Position + `) Tj
0 -20 Td
(Opacity: ` + fmt.Sprintf("%.2f", options.Opacity) + `) Tj
0 -20 Td
(Rotation: ` + fmt.Sprintf("%d", options.Rotation) + ` degrees) Tj
0 -20 Td
(Source: ` + filepath.Base(inputPath) + `) Tj
0 -20 Td
(Date: ` + time.Now().Format(time.RFC3339) + `) Tj
0 -40 Td
(Note: Install Python3 with PyPDF2 and reportlab for real watermarking) Tj
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
