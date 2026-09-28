-- Create user_quotas table for rate limiting
CREATE TABLE IF NOT EXISTS user_quotas (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    daily_limit INTEGER NOT NULL DEFAULT 10,
    daily_used INTEGER NOT NULL DEFAULT 0,
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on last_reset for time-based queries
CREATE INDEX IF NOT EXISTS idx_user_quotas_last_reset ON user_quotas(last_reset);
