-- =============================================
-- Calc3D - Admin & Database Full Setup Fix
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Create PROFILES table (needed for stats and user data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create FEEDBACK table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'suggestion',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.1 Create ANNOUNCEMENTS table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trigger to automatically create a profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable RLS on all relevant tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filaments ENABLE ROW LEVEL SECURITY;

-- 5. Policies for PROFILES
DROP POLICY IF EXISTS "profiles_self_read" ON public.profiles;
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com');

-- 6. Policies for FEEDBACK
DROP POLICY IF EXISTS "feedback_insert_policy" ON public.feedback;
CREATE POLICY "feedback_insert_policy" ON public.feedback FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "feedback_admin_all" ON public.feedback;
CREATE POLICY "feedback_admin_all" ON public.feedback FOR ALL USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com');

-- 7. Policies for PRINTERS (Allow authenticated suggestions)
DROP POLICY IF EXISTS "printers_public_read" ON public.printers;
CREATE POLICY "printers_public_read" ON public.printers FOR SELECT USING (true);

DROP POLICY IF EXISTS "printers_insert_suggestion" ON public.printers;
CREATE POLICY "printers_insert_suggestion" ON public.printers FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "printers_admin_all" ON public.printers;
CREATE POLICY "printers_admin_all" ON public.printers FOR ALL USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com');

-- 8. Policies for FILAMENTS (Allow authenticated suggestions)
DROP POLICY IF EXISTS "filaments_public_read" ON public.filaments;
CREATE POLICY "filaments_public_read" ON public.filaments FOR SELECT USING (true);

DROP POLICY IF EXISTS "filaments_insert_suggestion" ON public.filaments;
CREATE POLICY "filaments_insert_suggestion" ON public.filaments FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "filaments_admin_all" ON public.filaments;
CREATE POLICY "filaments_admin_all" ON public.filaments FOR ALL USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com');

-- 9. Policies for ANNOUNCEMENTS
DROP POLICY IF EXISTS "announcements_public_read" ON public.announcements;
CREATE POLICY "announcements_public_read" ON public.announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "announcements_admin_all" ON public.announcements;
CREATE POLICY "announcements_admin_all" ON public.announcements FOR ALL USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com');

-- 10. Update feedback policy for public read
DROP POLICY IF EXISTS "feedback_public_read" ON public.feedback;
CREATE POLICY "feedback_public_read" ON public.feedback FOR SELECT USING (is_public = true);

-- Populate profiles for existing users if any (safety net)
INSERT INTO public.profiles (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;
