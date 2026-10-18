-- COMMIT 20 INITIAL SUPABASE SCHEMA MIGRATION

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    total_practice_minutes INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    last_practice_date DATE,
    role TEXT DEFAULT 'learner' CHECK (role IN ('learner', 'creator', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sprints Table
CREATE TABLE IF NOT EXISTS public.sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('music', 'language', 'cooking', 'fitness_health', 'productivity_tech', 'art_craft', 'other')),
    target_hours INTEGER NOT NULL CHECK (target_hours >= 1 AND target_hours <= 20),
    promise_deliverable TEXT NOT NULL,
    prerequisites TEXT,
    cover_image_url TEXT,
    demo_video_url TEXT,
    is_published BOOLEAN DEFAULT false,
    enrollment_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Hourly Milestones Table
CREATE TABLE IF NOT EXISTS public.hourly_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sprint_id UUID NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE,
    hour_index INTEGER NOT NULL CHECK (hour_index >= 1 AND hour_index <= 20),
    title TEXT NOT NULL,
    guide_markdown TEXT NOT NULL,
    embed_video_url TEXT,
    checklist JSONB DEFAULT '[]'::jsonb,
    checkpoint_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sprint_id, hour_index)
);

-- 4. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sprint_id UUID NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    pace_type TEXT DEFAULT 'daily_1h' CHECK (pace_type IN ('daily_1h', 'weekend_sprint', 'self_paced')),
    current_hour INTEGER DEFAULT 1,
    total_minutes_practiced INTEGER DEFAULT 0,
    staked_amount DECIMAL(10, 2) DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, sprint_id)
);

-- 5. Practice Logs Table
CREATE TABLE IF NOT EXISTS public.practice_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hour_index INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Proof Submissions Table
CREATE TABLE IF NOT EXISTS public.proof_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sprint_id UUID NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE,
    is_final_deliverable BOOLEAN DEFAULT true,
    hour_index INTEGER,
    media_type TEXT NOT NULL CHECK (media_type IN ('video_embed', 'audio_embed', 'image_upload', 'external_link')),
    media_url TEXT NOT NULL,
    reflection TEXT,
    upvotes_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Kudos Table
CREATE TABLE IF NOT EXISTS public.kudos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.proof_submissions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction_type TEXT DEFAULT 'clap' CHECK (reaction_type IN ('clap', 'fire', 'heart', 'mindblown')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(submission_id, user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hourly_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudos ENABLE ROW LEVEL SECURITY;

-- Basic Public RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Published sprints are viewable by everyone" ON public.sprints FOR SELECT USING (is_published = true OR auth.uid() = creator_id);
CREATE POLICY "Creators can insert sprints" ON public.sprints FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own sprints" ON public.sprints FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Milestones viewable by everyone" ON public.hourly_milestones FOR SELECT USING (true);
CREATE POLICY "Submissions viewable by everyone" ON public.proof_submissions FOR SELECT USING (true);
CREATE POLICY "Users can create submissions" ON public.proof_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
