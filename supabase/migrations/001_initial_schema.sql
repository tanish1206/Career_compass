-- Career Compass Database Schema (AI-Ready)
-- This schema is designed to support both system-generated and AI-generated roadmaps

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profile with skill snapshot for AI personalization
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  target_domain TEXT,  -- e.g., "Frontend Developer", "Backend Developer"
  skill_snapshot JSONB, -- { dsa: 30, coreCS: 50, frameworks: 20 }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/write their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================
-- ROADMAPS TABLE
-- ============================================
-- Stores roadmap metadata with AI generation tracking
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  generated_by TEXT DEFAULT 'system' CHECK (generated_by IN ('system', 'ai')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own roadmaps
CREATE POLICY "Users can view own roadmaps" 
  ON roadmaps FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roadmaps" 
  ON roadmaps FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmaps" 
  ON roadmaps FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmaps" 
  ON roadmaps FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- ROADMAP_ITEMS TABLE
-- ============================================
-- Stores individual roadmap topics with AI-editable structure
CREATE TABLE roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT NOT NULL,  -- e.g., "html", "css", "javascript"
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  estimated_days INTEGER,
  position_x INTEGER DEFAULT 50,
  position_y INTEGER NOT NULL,
  prerequisites TEXT[], -- array of topic_ids for dependency tracking
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed'))
);

-- Enable Row Level Security
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can access items from their own roadmaps
CREATE POLICY "Users can view own roadmap items" 
  ON roadmap_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM roadmaps 
      WHERE roadmaps.id = roadmap_items.roadmap_id 
      AND roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own roadmap items" 
  ON roadmap_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM roadmaps 
      WHERE roadmaps.id = roadmap_items.roadmap_id 
      AND roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own roadmap items" 
  ON roadmap_items FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM roadmaps 
      WHERE roadmaps.id = roadmap_items.roadmap_id 
      AND roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own roadmap items" 
  ON roadmap_items FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM roadmaps 
      WHERE roadmaps.id = roadmap_items.roadmap_id 
      AND roadmaps.user_id = auth.uid()
    )
  );

-- ============================================
-- PROGRESS TABLE
-- ============================================
-- Tracks user progress with AI verification support
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT NOT NULL,
  completion_percent INTEGER DEFAULT 0 CHECK (completion_percent >= 0 AND completion_percent <= 100),
  verified BOOLEAN DEFAULT FALSE,  -- For future AI-assisted verification
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Enable Row Level Security
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own progress
CREATE POLICY "Users can view own progress" 
  ON progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX idx_roadmap_items_roadmap_id ON roadmap_items(roadmap_id);
CREATE INDEX idx_roadmap_items_topic_id ON roadmap_items(topic_id);
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_topic_id ON progress(topic_id);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE profiles IS 'User profiles with skill snapshots for AI personalization';
COMMENT ON TABLE roadmaps IS 'Roadmap metadata tracking system vs AI generation';
COMMENT ON TABLE roadmap_items IS 'Individual roadmap topics with prerequisites for AI editing';
COMMENT ON TABLE progress IS 'User progress tracking with AI verification support';

COMMENT ON COLUMN roadmaps.generated_by IS 'Tracks whether roadmap was system-generated or AI-generated';
COMMENT ON COLUMN profiles.skill_snapshot IS 'JSON snapshot of user skills at roadmap creation time';
COMMENT ON COLUMN roadmap_items.prerequisites IS 'Array of topic_ids that must be completed first';
COMMENT ON COLUMN progress.verified IS 'Boolean for future AI-assisted progress verification';
