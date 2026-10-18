-- COMMIT 20: UGC & SIMULATOR SCHEMA MIGRATION
-- Migration: 20261018000001_ugc_simulator_schema.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('music', 'language', 'lifestyle', 'tech', 'art', 'soft-skills', 'other')),
    target_deliverable TEXT NOT NULL,
    duration_tier TEXT NOT NULL CHECK (duration_tier IN ('1h', '5h', '20h')),
    simulator_type TEXT NOT NULL CHECK (simulator_type IN ('guitar', 'voice-pitch', 'prompt-ai', 'sandbox')),
    simulator_config JSONB DEFAULT '{}'::jsonb,
    creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    enroll_count INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Course Modules Table (1 to 20 milestones)
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    module_index INTEGER NOT NULL CHECK (module_index >= 1 AND module_index <= 20),
    title TEXT NOT NULL,
    deliverable_milestone TEXT NOT NULL,
    guide_video_url TEXT,
    instructions_markdown TEXT,
    tab_data JSONB DEFAULT '{}'::jsonb,
    submission_type TEXT DEFAULT 'audio' CHECK (submission_type IN ('audio', 'video', 'text', 'file')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, module_index)
);

-- 3. Proof Submissions Table (Audio/video recorded by learners)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.course_modules(id) ON DELETE SET NULL,
    media_url TEXT NOT NULL,
    reflection_notes TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Enrollments & Progress Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    current_module_index INTEGER DEFAULT 1,
    completed_modules INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    total_practice_seconds INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON public.course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_submissions_course_module ON public.submissions(course_id, module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON public.enrollments(user_id, course_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Courses RLS Policies
CREATE POLICY "Public can view published courses"
    ON public.courses FOR SELECT
    USING (is_published = true);

CREATE POLICY "Users can create their own courses"
    ON public.courses FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own courses"
    ON public.courses FOR UPDATE
    USING (auth.uid() = creator_id);

-- Course Modules RLS Policies
CREATE POLICY "Public can view modules of published courses"
    ON public.course_modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_modules.course_id
            AND courses.is_published = true
        )
    );

CREATE POLICY "Creators can manage modules of their courses"
    ON public.course_modules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_modules.course_id
            AND courses.creator_id = auth.uid()
        )
    );

-- Submissions RLS Policies
CREATE POLICY "Public can view submissions"
    ON public.submissions FOR SELECT
    USING (true);

CREATE POLICY "Users can create submissions"
    ON public.submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Enrollments RLS Policies
CREATE POLICY "Users can view their own enrollments"
    ON public.enrollments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own enrollments"
    ON public.enrollments FOR ALL
    USING (auth.uid() = user_id);

-- SEED INITIAL VIRAL COURSES
INSERT INTO public.courses (id, slug, title, description, category, target_deliverable, duration_tier, simulator_type, simulator_config, is_published, enroll_count)
VALUES 
(
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'guitar-3-songs',
    'Đệm hát 3 bài Guitar đốt lửa trại sau 20 giờ',
    'Chỉ tập trung 4 hợp âm cốt lõi (C - G - Am - F) và cách quạt nhịp 4/4 để đệm hát mượt mà 3 bài hát quen thuộc không cần nhạc lý hàn lâm.',
    'music',
    'Tự đệm hát trọn vẹn 3 bài: Tuổi Hồng Thơ Ngây, Nàng Thơ, Bông Hoa Đẹp Nhất',
    '20h',
    'guitar',
    '{
        "allowed_chords": ["Am", "C", "G", "Em", "Fmaj7", "Dm"],
        "default_bpm": 80,
        "default_fret_zoom": 4,
        "songs": [
            {"title": "Tuổi Hồng Thơ Ngây", "chords": ["Am", "C", "G", "Em"], "tempo": 75},
            {"title": "Nàng Thơ", "chords": ["C", "G", "Am", "Fmaj7"], "tempo": 82},
            {"title": "Bông Hoa Đẹp Nhất", "chords": ["Am", "Fmaj7", "C", "G"], "tempo": 88}
        ]
    }'::jsonb,
    true,
    1420
),
(
    'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    'sing-chinese-pop',
    'Hát chuẩn 1 bài Pop tiếng Trung sau 20 giờ',
    'Làm chủ phát âm Pinyin chuẩn xác, luyến láy giai điệu và cao độ bài hát hit "Phi Điểu Và Ve Sầu" sau 20 giờ luyện tập với máy đo cao độ.',
    'language',
    'Bản thu âm hát chuẩn Pinyin & đúng cao độ bài Phi Điểu Và Ve Sầu',
    '20h',
    'voice-pitch',
    '{
        "song_title": "Phi Điểu Và Ve Sầu (飞鸟和蝉)",
        "artist": "Nhậm Nhiên (Ren Ran)",
        "key": "C Major",
        "bpm": 76,
        "pinyin_lyrics": "Nǐ shì fēiniǎo wǒ shì chán, kànzhe nǐ fēixiàng tiānbiān"
    }'::jsonb,
    true,
    890
)
ON CONFLICT (slug) DO NOTHING;

-- SEED 20 MODULES FOR GUITAR 20H COURSE
INSERT INTO public.course_modules (course_id, module_index, title, deliverable_milestone, instructions_markdown, tab_data, submission_type)
VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 1, 'Giờ 1: Làm quen cần đàn & Thế bấm hợp âm Am chuẩn', 'Bấm kêu tròn tiếng 6 dây hợp âm Am trên cần đàn ảo', 'Đặt ngón 1 vào dây 2 ngăn 1, ngón 2 vào dây 4 ngăn 2, ngón 3 vào dây 3 ngăn 2. Dùng bàn quạt vuốt nhẹ để nghe âm vang.', '{"chord": "Am", "frets": [-1, 0, 2, 2, 1, 0], "fingers": [0, 0, 2, 3, 1, 0]}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 2, 'Giờ 2: Chinh phục hợp âm C (Đô Trưởng) & Quạt nhịp 4/4', 'Đổi qua lại giữa Am và C trong 4 nhịp không ngắt quãng', 'Chỉ cần nhấc ngón 3 từ dây 3 ngăn 2 sang dây 5 ngăn 3 là chuyển thành C! Giữ nguyên ngón 1 và ngón 2.', '{"chord": "C", "frets": [-1, 3, 2, 0, 1, 0], "fingers": [0, 3, 2, 0, 1, 0]}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 3, 'Giờ 3: Luyện nhịp Down-strum đều đặn cùng Metronome 60BPM', 'Quạt đều 4 phách xuống trên hợp âm Am và C', 'Bật Metronome ở 60 BPM. Mỗi tiếng gõ quạt 1 nhịp xuống nhẹ nhàng.', '{"bpm": 60, "pattern": "D D D D"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 4, 'Giờ 4: Thế bấm hợp âm Em (Mi Thứ) siêu dễ', 'Chuyển mượt mà Am - Em - C trong vòng 8 nhịp', 'Em chỉ dùng 2 ngón tay: ngón 2 dây 5 ngăn 2, ngón 3 dây 4 ngăn 2. Quạt cả 6 dây vang rền.', '{"chord": "Em", "frets": [0, 2, 2, 0, 0, 0], "fingers": [0, 2, 3, 0, 0, 0]}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 5, 'Giờ 5: Hợp âm G (Sol Trưởng) thế 3 ngón cơ bản', 'Bấm hợp âm G không bị tịt dây 1', 'Ngón 1 dây 5 ngăn 2, ngón 2 dây 6 ngăn 3, ngón 3 dây 1 ngăn 3.', '{"chord": "G", "frets": [3, 2, 0, 0, 0, 3], "fingers": [2, 1, 0, 0, 0, 3]}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 6, 'Giờ 6: Vòng hòa thanh thần thánh (Am - C - G - Em)', 'Chuyển trơn tru 4 hợp âm liên tục 2 vòng', 'Luyện tập chuyển ngón tay trước khi phách 1 của ô nhịp tiếp theo bắt đầu.', '{"progression": ["Am", "C", "G", "Em"]}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 7, 'Giờ 7: Điệu Disco Ballad cơ bản (Xuống - Nghỉ - Xuống Lên)', 'Quạt nhịp Ballad căn bản 4 nhịp trên Am', 'Xuống ... Xuống Lên Xuống Lên. Giữ cổ tay thật thả lỏng.', '{"pattern": "D . D U D U"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 8, 'Giờ 8: Bài 1 - Ghép câu hát đầu "Tuổi Hồng Thơ Ngây"', 'Đệm câu: "Tuổi hồng thơ ngây dưới mái trường..."', 'Vào nhịp đúng ở chữ "thơ" tương ứng phách 1 của Am.', '{"song": "Tuổi Hồng Thơ Ngây", "part": "Intro & Đoạn 1"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 9, 'Giờ 9: Bài 1 - Đoạn Điệp khúc cao trào', 'Quạt điệu Ballad mạnh mẽ ở đoạn điệp khúc', 'Tăng lực gảy ngón cái khi vuốt qua các dây bổng ở điệp khúc.', '{"song": "Tuổi Hồng Thơ Ngây", "part": "Chorus"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 10, 'Giờ 10: Hoàn thành bài 1 - Thu âm bản thu tốt nghiệp bài 1', 'Nộp bản thu trọn vẹn bài "Tuổi Hồng Thơ Ngây"', 'Ghi âm 30 giây đoạn điệp khúc để hoàn thành milestone 10 giờ đầu tiên!', '{"milestone": "Song 1 Completed"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 11, 'Giờ 11: Làm chủ Fmaj7 - Bí kíp không cần chặn ngón F khó', 'Bấm hợp âm Fmaj7 vang thanh thoát', 'F chặn quá đau tay cho người mới? Dùng Fmaj7: dây 2 ngăn 1, dây 3 ngăn 2, dây 4 ngăn 3. Không cần chặn!', '{"chord": "Fmaj7", "frets": [-1, -1, 3, 2, 1, 0], "fingers": [0, 0, 3, 2, 1, 0]}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 12, 'Giờ 12: Vòng hòa thanh hiện đại C - G - Am - Fmaj7', 'Đổi mượt mà vòng hòa thanh của "Nàng Thơ"', 'Vòng này được dùng trong 80% các bài hit V-Pop hiện đại.', '{"progression": ["C", "G", "Am", "Fmaj7"]}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 13, 'Giờ 13: Bài 2 - Nhập môn "Nàng Thơ" (Hoàng Dũng)', 'Đệm trơn tru verse 1: "Em, ngày em đánh rơi nụ cười..."', 'Nhịp êm dịu, quạt nhẹ 4 dây dưới.', '{"song": "Nàng Thơ", "part": "Verse 1"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 14, 'Giờ 14: Bài 2 - Điệp khúc Nàng Thơ & Kỹ thuật rải ngón', 'Rải dây Bass 3 2 1 xen kẽ quạt chém', 'Gảy ngón cái dây bass (dây 5 cho C, dây 6 cho G) rồi vuốt nhẹ dây bổng.', '{"song": "Nàng Thơ", "part": "Chorus"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 15, 'Giờ 15: Hoàn thành bài 2 - Nộp bài hát "Nàng Thơ"', 'Bản thu âm 1 phút đệm hát trọn vẹn "Nàng Thơ"', 'Nộp bản thu để mở khóa 5 giờ thực chiến cuối cùng.', '{"milestone": "Song 2 Completed"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 16, 'Giờ 16: Hợp âm Dm (Rê Thứ) & Kỹ thuật chuyển ngón nhanh', 'Bấm chuẩn xác Dm không chạm ngón vào dây buông', 'Dây 1 ngăn 1, dây 3 ngăn 2, dây 2 ngăn 3.', '{"chord": "Dm", "frets": [-1, -1, 0, 2, 3, 1], "fingers": [0, 0, 0, 2, 3, 1]}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 17, 'Giờ 17: Bài 3 - "Bông Hoa Đẹp Nhất" (Quân A.P) Verse & Pre-chorus', 'Đệm trơn tru phân đoạn 1 bài số 3', 'Hợp âm: Am - Fmaj7 - C - G. Tốc độ nhịp 88 BPM.', '{"song": "Bông Hoa Đẹp Nhất", "part": "Verse"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 18, 'Giờ 18: Bài 3 - Điệp khúc bùng nổ cùng điệu Ballad dồn dập', 'Quạt điệp khúc đầy cảm xúc không vấp nhịp', 'D D U U D U đầy uy lực.', '{"song": "Bông Hoa Đẹp Nhất", "part": "Chorus"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 19, 'Giờ 19: Luyện tập liên hoàn 3 bài trong không gian lửa trại', 'Chơi liền mạch mỗi bài 1 đoạn theo danh sách phát', 'Tập phản xạ đổi hợp âm tự nhiên không cần nhìn tay.', '{"milestone": "Campfire Rehearsal"}'::jsonb, 'audio'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 20, 'Giờ 20: TỐT NGHIỆP - Thu âm trọn bộ 3 bài & Nhận Chứng Nhận Commit 20', 'Nộp bản thu tốt nghiệp & xuất thẻ Story 9:16 Flex mạng xã hội', 'Chúc mừng bạn đã chinh phục 20 giờ! Thu âm bài thi và nhận thẻ chứng nhận có mã QR.', '{"milestone": "GRADUATION CERTIFICATE"}'::jsonb, 'audio')
ON CONFLICT (course_id, module_index) DO NOTHING;
