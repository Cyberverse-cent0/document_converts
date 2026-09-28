package models

import "time"

type JobStatus string

const (
	JobQueued     JobStatus = "queued"
	JobProcessing JobStatus = "processing"
	JobCompleted  JobStatus = "completed"
	JobFailed     JobStatus = "failed"
)

type Job struct {
	ID           string    `json:"id"`
	UserID       string    `json:"user_id"`
	FileName     string    `json:"file_name"`
	Mode         string    `json:"mode"`
	OriginalPath string    `json:"original_path,omitempty"`
	OutputPath   string    `json:"output_path,omitempty"`
	Status       JobStatus `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
