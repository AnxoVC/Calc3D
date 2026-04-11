-- =============================================
-- MyCalc3D - Admin & Database Full Setup Fix
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

-- 2.0.1 Ensure is_public column exists if table was already there
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='is_public') THEN
    ALTER TABLE public.feedback ADD COLUMN is_public BOOLEAN DEFAULT false;
  END IF;
END $$;

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
-- Tablas de comunidad y actividad
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own activity') THEN
        CREATE POLICY "Users can insert their own activity" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can read all activity') THEN
        CREATE POLICY "Admins can read all activity" ON activity_logs FOR SELECT USING (auth.jwt() ->> 'email' = 'vigoanxo000@gmail.com');
    END IF;
END $$;

-- 11. Rate Limiting for Feedback (Protección contra Spam)
-- Limitamos a 3 mensajes por hora por usuario para evitar inundaciones.
CREATE OR REPLACE FUNCTION public.check_feedback_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  msg_count INTEGER;
BEGIN
  -- Contar mensajes del mismo usuario en la última hora
  SELECT count(*) INTO msg_count
  FROM public.feedback
  WHERE (user_id = auth.uid() OR (user_id IS NULL AND auth.uid() IS NULL))
    AND created_at > NOW() - INTERVAL '1 hour';

  IF msg_count >= 3 THEN
    RAISE EXCEPTION 'Límite de sugerencias excedido. Inténtalo de nuevo en una hora.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_feedback_rate_limit ON public.feedback;
CREATE TRIGGER tr_feedback_rate_limit
  BEFORE INSERT ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.check_feedback_rate_limit();
