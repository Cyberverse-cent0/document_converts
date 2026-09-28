package scanner

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Scanner struct {
	maxFileSize      int64
	allowedExtensions []string
}

func NewScanner() *Scanner {
	return &Scanner{
		maxFileSize:      50 * 1024 * 1024, // 50MB default max file size
		allowedExtensions: []string{".pdf", ".doc", ".docx"},
	}
}

// ScanFile performs basic file validation (size, type, etc.)
// In production, this would integrate with ClamAV for malware scanning
func (s *Scanner) ScanFile(filePath string) (*ScanResult, error) {
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to stat file: %w", err)
	}

	// Check file size
	if fileInfo.Size() > s.maxFileSize {
		return &ScanResult{
			Status:   ScanFailed,
			Error:    fmt.Sprintf("file size exceeds limit of %d bytes", s.maxFileSize),
			FileName: filepath.Base(filePath),
		}, nil
	}

	// Check file extension
	ext := strings.ToLower(filepath.Ext(filePath))
	allowed := false
	for _, allowedExt := range s.allowedExtensions {
		if ext == allowedExt {
			allowed = true
			break
		}
	}

	if !allowed {
		return &ScanResult{
			Status:   ScanFailed,
			Error:    fmt.Sprintf("file type %s is not allowed", ext),
			FileName: filepath.Base(filePath),
		}, nil
	}

	// In production, you would integrate with ClamAV here
	// For now, we'll do basic validation and mark as clean
	return &ScanResult{
		Status:   ScanClean,
		FileName: filepath.Base(filePath),
		FileSize: fileInfo.Size(),
		Message:  "File passed basic validation",
	}, nil
}

type ScanStatus string

const (
	ScanPending  ScanStatus = "pending"
	ScanScanning ScanStatus = "scanning"
	ScanClean    ScanStatus = "clean"
	ScanInfected ScanStatus = "infected"
	ScanFailed   ScanStatus = "failed"
)

type ScanResult struct {
	Status   ScanStatus `json:"status"`
	FileName string     `json:"file_name"`
	FileSize int64      `json:"file_size,omitempty"`
	Error    string     `json:"error,omitempty"`
	Message  string     `json:"message,omitempty"`
}

// ValidateFileSize checks if a file is within size limits
func (s *Scanner) ValidateFileSize(filePath string) error {
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return fmt.Errorf("failed to stat file: %w", err)
	}

	if fileInfo.Size() > s.maxFileSize {
		return fmt.Errorf("file size %d exceeds limit of %d bytes", fileInfo.Size(), s.maxFileSize)
	}

	return nil
}

// ValidateFileType checks if a file has an allowed extension
func (s *Scanner) ValidateFileType(filePath string) error {
	ext := strings.ToLower(filepath.Ext(filePath))
	for _, allowedExt := range s.allowedExtensions {
		if ext == allowedExt {
			return nil
		}
	}
	return fmt.Errorf("file type %s is not allowed", ext)
}
