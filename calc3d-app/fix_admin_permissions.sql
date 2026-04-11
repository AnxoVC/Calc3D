-- =============================================
-- Calc3D - Admin & Feedback Permissions Fix
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Create feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'suggestion',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 3. Policies for Feedback
DROP POLICY IF EXISTS "feedback_insert_policy" ON feedback;
CREATE POLICY "feedback_insert_policy" ON feedback 
FOR INSERT WITH CHECK (true); -- Anyone can send feedback

DROP POLICY IF EXISTS "feedback_admin_all" ON feedback;
CREATE POLICY "feedback_admin_all" ON feedback
FOR ALL USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com');

-- 4. Policies for Printers (Allow suggestions)
DROP POLICY IF EXISTS "printers_insert_suggestion" ON printers;
CREATE POLICY "printers_insert_suggestion" ON printers
FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "printers_admin_all" ON printers;
CREATE POLICY "printers_admin_all" ON printers
FOR ALL USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com');

-- 5. Policies for Filaments (Allow suggestions)
DROP POLICY IF EXISTS "filaments_insert_suggestion" ON filaments;
CREATE POLICY "filaments_insert_suggestion" ON filaments
FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "filaments_admin_all" ON filaments;
CREATE POLICY "filaments_admin_all" ON filaments
FOR ALL USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com');

-- 6. Ensure admin can see all profiles (for stats)
DROP POLICY IF EXISTS "profiles_admin_read" ON profiles;
CREATE POLICY "profiles_admin_read" ON profiles
FOR SELECT USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com' OR auth.uid() = id);
