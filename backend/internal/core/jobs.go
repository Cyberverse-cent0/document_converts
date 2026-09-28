package core

import (
	"fmt"
	"sync"
	"time"
)

type JobStatus string

const (
	JobQueued     JobStatus = "queued"
	JobProcessing JobStatus = "processing"
	JobCompleted  JobStatus = "completed"
	JobFailed     JobStatus = "failed"
)

type ConversionJob struct {
	ID           string    `json:"id"`
	FileName     string    `json:"file_name"`
	Mode         string    `json:"mode"`
	OriginalPath string    `json:"original_path,omitempty"`
	OutputPath   string    `json:"output_path,omitempty"`
	Status       JobStatus `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type JobStore struct {
	mu   sync.Mutex
	jobs map[string]*ConversionJob
}

func NewJobStore() *JobStore {
	return &JobStore{jobs: make(map[string]*ConversionJob)}
}

func (s *JobStore) CreateJob(fileName, mode, originalPath string) *ConversionJob {
	now := time.Now()
	job := &ConversionJob{
		ID:           fmt.Sprintf("job-%d", now.UnixNano()),
		FileName:     fileName,
		Mode:         mode,
		OriginalPath: originalPath,
		Status:       JobQueued,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	s.jobs[job.ID] = job
	return job
}

func (s *JobStore) GetJob(id string) (*ConversionJob, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	job, ok := s.jobs[id]
	return job, ok
}

func (s *JobStore) ListJobs() []*ConversionJob {
	s.mu.Lock()
	defer s.mu.Unlock()
	jobs := make([]*ConversionJob, 0, len(s.jobs))
	for _, job := range s.jobs {
		jobs = append(jobs, job)
	}
	return jobs
}

func (s *JobStore) UpdateJob(id string, status JobStatus, outputPath string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	job, ok := s.jobs[id]
	if !ok {
		return
	}
	job.Status = status
	job.OutputPath = outputPath
	job.UpdatedAt = time.Now()
}
