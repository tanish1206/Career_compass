# Supabase Database Setup

## Running the Migration

1. **Go to your Supabase Dashboard:**
   https://lcttuwyvsndaeokxseok.supabase.co

2. **Navigate to SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste the contents of:**
   `supabase/migrations/001_initial_schema.sql`

4. **Click "Run"**

5. **Verify tables were created:**
   - Go to "Table Editor"
   - You should see: `profiles`, `roadmaps`, `roadmap_items`, `progress`

## Schema Overview

### Tables Created:
- **profiles**: User profile with skill snapshot (AI input)
- **roadmaps**: Roadmap metadata with `generated_by` flag (system/ai)
- **roadmap_items**: Individual topics with prerequisites (AI editable)
- **progress**: User progress tracking with verification flag (AI verifiable)

### AI-Ready Features:
- `generated_by` field tracks system vs AI roadmaps
- `skill_snapshot` JSONB stores user skills for AI personalization
- `prerequisites` array enables AI dependency management
- `verified` boolean prepares for AI-assisted verification

All tables have Row Level Security (RLS) enabled for user data protection.
