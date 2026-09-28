package core

import (
	"path/filepath"
	"testing"
)

func TestIsSupportedFile(t *testing.T) {
	tests := map[string]bool{
		"report.pdf":  true,
		"report.docx": true,
		"report.doc":  true,
		"report.xlsx": true,
		"slides.pptx": true,
		"image.jpg":   true,
		"image.png":   true,
		"report.txt":  false,
		"report":      false,
	}

	for name, want := range tests {
		if got := IsSupportedFile(name); got != want {
			t.Fatalf("IsSupportedFile(%q) = %v, want %v", name, got, want)
		}
	}
}

func TestBuildOutputPath(t *testing.T) {
	out := BuildOutputPath("/tmp/input.pdf", "/tmp/output")
	if filepath.Ext(out) != ".docx" {
		t.Fatalf("expected .docx output, got %s", out)
	}
	if filepath.Base(out) != "input.docx" {
		t.Fatalf("expected output filename input.docx, got %s", filepath.Base(out))
	}
}
