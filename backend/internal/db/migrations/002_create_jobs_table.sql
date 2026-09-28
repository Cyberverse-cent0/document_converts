-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    mode VARCHAR(50) NOT NULL,
    original_path TEXT,
    output_path TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'queued',
    scan_status VARCHAR(50) DEFAULT 'pending',
    is_encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

-- Create index on updated_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_jobs_updated_at ON jobs(updated_at);
