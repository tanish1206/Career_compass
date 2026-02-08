-- Migration: Create user_state table for centralized user data
-- This table stores the entire user state as JSONB for flexibility

CREATE TABLE IF NOT EXISTS user_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_state_user_id ON user_state(user_id);

-- Create index on updated_at for sorting by recency
CREATE INDEX IF NOT EXISTS idx_user_state_updated_at ON user_state(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE user_state ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only access their own data
CREATE POLICY user_state_access_policy ON user_state
  FOR ALL
  USING (user_id = current_setting('app.current_user_id', true));

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_state_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_state_updated_at_trigger
  BEFORE UPDATE ON user_state
  FOR EACH ROW
  EXECUTE FUNCTION update_user_state_timestamp();

-- Add comment for documentation
COMMENT ON TABLE user_state IS 'Stores complete user state including profile, skills, roadmap progress, projects, and mock test history as JSONB for flexibility';
COMMENT ON COLUMN user_state.state IS 'Complete UserState object stored as JSONB - includes profile, skills, roadmap, projects, mockTests, and metadata';
