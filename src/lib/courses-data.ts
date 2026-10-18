import { Course, CourseModule } from '@/types/database'

export interface ChordDefinition {
  name: string
  // 6 strings: index 0 = String 6 (E2 low), index 5 = String 1 (E4 high)
  // Value: -1 for mute (X), 0 for open (O), 1-4 for fret number
  frets: [number, number, number, number, number, number]
  // Finger to use for each string (1: Index, 2: Middle, 3: Ring, 4: Pinky, 0: none)
  fingers: [number, number, number, number, number, number]
  color?: string
}

export const CHORD_DICTIONARY: Record<string, ChordDefinition> = {
  Am: {
    name: 'Am',
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    color: '#FE7141', // Flame orange
  },
  C: {
    name: 'C',
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    color: '#3B82F6', // Blue
  },
  G: {
    name: 'G',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    color: '#10B981', // Emerald green
  },
  Em: {
    name: 'Em',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    color: '#8B5CF6', // Purple
  },
  Fmaj7: {
    name: 'Fmaj7',
    frets: [-1, -1, 3, 2, 1, 0],
    fingers: [0, 0, 3, 2, 1, 0],
    color: '#EC4899', // Pink
  },
  Dm: {
    name: 'Dm',
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    color: '#F59E0B', // Amber
  },
}

export const INITIAL_GUITAR_MODULES: CourseModule[] = [
  {
    id: 'm-01',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 1,
    title: 'Giờ 1: Thế bấm hợp âm Am (La Thứ) chuẩn',
    deliverable_milestone: 'Bấm kêu tròn tiếng 6 dây hợp âm Am trên cần đàn ảo',
    instructions_markdown: 'Đặt ngón 1 vào dây 2 ngăn 1, ngón 2 vào dây 4 ngăn 2, ngón 3 vào dây 3 ngăn 2. Dùng ngón cái vuốt nhẹ bàn quạt dây bên dưới để nghe từng nốt vang ấm.',
    tab_data: { chord: 'Am', frets: [-1, 0, 2, 2, 1, 0] },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-02',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 2,
    title: 'Giờ 2: Chinh phục hợp âm C (Đô Trưởng) & Quạt 4/4',
    deliverable_milestone: 'Đổi qua lại giữa Am và C trong 4 nhịp không vấp',
    instructions_markdown: 'Mẹo chuyển thần tốc: Giữ nguyên ngón 1 và ngón 2! Bạn chỉ cần nhấc ngón 3 từ dây 3 ngăn 2 sang dây 5 ngăn 3 là chuyển thành C hoàn hảo.',
    tab_data: { chord: 'C', frets: [-1, 3, 2, 0, 1, 0] },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-03',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 3,
    title: 'Giờ 3: Luyện nhịp Down-strum cùng Metronome 60BPM',
    deliverable_milestone: 'Quạt đều 4 phách xuống trên Am và C',
    instructions_markdown: 'Bật máy đếm nhịp ở 60 BPM. Mỗi tiếng gõ "Tách" hãy vuốt 1 nhịp xuống nhẹ nhàng, cổ tay thả lỏng như gõ thước kẻ.',
    tab_data: { bpm: 60, pattern: 'D D D D' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-04',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 4,
    title: 'Giờ 4: Thế bấm hợp âm Em (Mi Thứ) siêu êm',
    deliverable_milestone: 'Chuyển mượt mà Am - Em - C trong vòng 8 nhịp',
    instructions_markdown: 'Em chỉ dùng 2 ngón tay: ngón 2 dây 5 ngăn 2, ngón 3 dây 4 ngăn 2. Quạt cả 6 dây nghe cực kỳ vang và dày âm bass.',
    tab_data: { chord: 'Em', frets: [0, 2, 2, 0, 0, 0] },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-05',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 5,
    title: 'Giờ 5: Hợp âm G (Sol Trưởng) thế 3 ngón kinh điển',
    deliverable_milestone: 'Bấm hợp âm G tròn nốt không tịt dây 1',
    instructions_markdown: 'Ngón 1 đặt ở dây 5 ngăn 2, ngón 2 đặt ở dây 6 ngăn 3, ngón 3 đặt ở dây 1 ngăn 3. Hợp âm này tạo cảm giác tươi sáng, ấm áp.',
    tab_data: { chord: 'G', frets: [3, 2, 0, 0, 0, 3] },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-06',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 6,
    title: 'Giờ 6: Vòng hòa thanh thần thánh (Am - C - G - Em)',
    deliverable_milestone: 'Chuyển trơn tru 4 hợp âm liên tục 2 vòng',
    instructions_markdown: 'Bí quyết: Luôn chuẩn bị tư thế ngón tay trước khi phách 1 của ô nhịp kế tiếp vang lên. Đừng dừng nhịp đập của tay phải.',
    tab_data: { progression: ['Am', 'C', 'G', 'Em'] },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-07',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 7,
    title: 'Giờ 7: Điệu Disco Ballad (Xuống - Nghỉ - Xuống Lên)',
    deliverable_milestone: 'Quạt nhịp Ballad cơ bản 4 nhịp trên Am',
    instructions_markdown: 'Công thức quạt: Xuống ... Xuống Lên Xuống Lên. Nhịp phách 2 và 4 nhấn nhẹ hơn để tạo độ nảy cho điệu hát.',
    tab_data: { pattern: 'D . D U D U' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-08',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 8,
    title: 'Giờ 8: Bài 1 - Ghép câu hát đầu "Tuổi Hồng Thơ Ngây"',
    deliverable_milestone: 'Đệm câu: "Tuổi hồng thơ ngây dưới mái trường..."',
    instructions_markdown: 'Vào nhịp phách 1 rơi đúng vào chữ "thơ" tương ứng hợp âm Am. Câu tiếp theo sang C ở chữ "mái".',
    tab_data: { song: 'Tuổi Hồng Thơ Ngây', part: 'Intro & Verse 1' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-09',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 9,
    title: 'Giờ 9: Bài 1 - Đoạn Điệp khúc cao trào',
    deliverable_milestone: 'Quạt điệu Ballad mạnh mẽ ở đoạn điệp khúc',
    instructions_markdown: 'Vuốt ngón cái mạnh hơn qua các dây bổng 1, 2, 3 để tạo cảm giác tiếng đàn bừng sáng khi bước vào điệp khúc.',
    tab_data: { song: 'Tuổi Hồng Thơ Ngây', part: 'Chorus' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-10',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 10,
    title: 'Giờ 10: Tốt nghiệp bài 1 - Nộp bản thu "Tuổi Hồng Thơ Ngây"',
    deliverable_milestone: 'Nộp bản thu 30 giây bài 1 để hoàn thành 50% chặng đường',
    instructions_markdown: 'Bấm nút "Ghi âm" bên dưới và gảy đoạn điệp khúc 30 giây. Nghe lại và bấm Nộp bài để lưu dấu mốc 10 giờ đầu tiên!',
    tab_data: { milestone: 'Song 1 Completed' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-11',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 11,
    title: 'Giờ 11: Làm chủ Fmaj7 - Không cần chặn ngón khó khăn',
    deliverable_milestone: 'Bấm hợp âm Fmaj7 tròn tiếng và thanh thoát',
    instructions_markdown: 'Hợp âm F chặn ngón gây nản lòng cho 90% người mới? Hãy dùng Fmaj7 thay thế hoàn hảo: dây 2 ngăn 1, dây 3 ngăn 2, dây 4 ngăn 3. Không đau tay!',
    tab_data: { chord: 'Fmaj7', frets: [-1, -1, 3, 2, 1, 0] },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-12',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 12,
    title: 'Giờ 12: Vòng hòa thanh hiện đại C - G - Am - Fmaj7',
    deliverable_milestone: 'Đổi mượt mà 4 hợp âm của bản hit "Nàng Thơ"',
    instructions_markdown: 'Vòng hòa thanh này xuất hiện trong hầu hết các bản hit V-Pop lãng mạn. Luyện tập chuyển ngón nhịp nhàng không ngắt quãng.',
    tab_data: { progression: ['C', 'G', 'Am', 'Fmaj7'] },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-13',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 13,
    title: 'Giờ 13: Bài 2 - Nhập môn "Nàng Thơ" (Hoàng Dũng)',
    deliverable_milestone: 'Đệm trơn tru verse 1: "Em, ngày em đánh rơi nụ cười..."',
    instructions_markdown: 'Quạt nhẹ ở 4 dây dưới (dây 4, 3, 2, 1) để tạo không gian tĩnh lặng, lãng mạn cho giọng hát vang lên.',
    tab_data: { song: 'Nàng Thơ', part: 'Verse 1' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-14',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 14,
    title: 'Giờ 14: Bài 2 - Điệp khúc Nàng Thơ bay bổng',
    deliverable_milestone: 'Quạt bùng nổ đoạn điệp khúc "Hãy cứ bước đi..."',
    instructions_markdown: 'Chuyển ngón dứt khoát sang Fmaj7 ở đầu câu điệp khúc để tạo độ sâu cảm xúc.',
    tab_data: { song: 'Nàng Thơ', part: 'Chorus' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-15',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 15,
    title: 'Giờ 15: Tốt nghiệp bài 2 - Nộp bản thu "Nàng Thơ"',
    deliverable_milestone: 'Bản thu âm 1 phút đệm trọn vẹn "Nàng Thơ"',
    instructions_markdown: 'Thu âm bài hát và chia sẻ ngay cho bạn bè để nhận những tràng vỗ tay cổ vũ.',
    tab_data: { milestone: 'Song 2 Completed' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-16',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 16,
    title: 'Giờ 16: Hợp âm Dm (Rê Thứ) & Mẹo chuyển ngón tam giác',
    deliverable_milestone: 'Bấm chuẩn xác Dm không chạm ngón vào dây buông',
    instructions_markdown: 'Ngón 1 ở dây 1 ngăn 1, ngón 2 ở dây 3 ngăn 2, ngón 3 ở dây 2 ngăn 3 tạo thành hình tam giác nhỏ. Chỉ quạt 4 dây dưới.',
    tab_data: { chord: 'Dm', frets: [-1, -1, 0, 2, 3, 1] },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-17',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 17,
    title: 'Giờ 17: Bài 3 - "Bông Hoa Đẹp Nhất" Verse & Pre-chorus',
    deliverable_milestone: 'Đệm trơn tru phân đoạn 1 bài số 3',
    instructions_markdown: 'Vòng hợp âm: Am - Fmaj7 - C - G. Tốc độ nhịp 88 BPM vui tươi, dứt khoát.',
    tab_data: { song: 'Bông Hoa Đẹp Nhất', part: 'Verse' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-18',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 18,
    title: 'Giờ 18: Bài 3 - Điệp khúc dồn dập đầy năng lượng',
    deliverable_milestone: 'Quạt điệu Ballad dồn dập không vấp nhịp',
    instructions_markdown: 'Đoạn này quạt nhanh và đều: Xuống Xuống Lên Lên Xuống Lên để giữ nhiệt bài hát.',
    tab_data: { song: 'Bông Hoa Đẹp Nhất', part: 'Chorus' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-19',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 19,
    title: 'Giờ 19: Luyện tập liên hoàn 3 bài trong đêm lửa trại',
    deliverable_milestone: 'Chơi liền mạch mỗi bài 1 đoạn theo danh sách phát',
    instructions_markdown: 'Hãy tưởng tượng bạn đang ngồi quanh đống lửa cùng bạn bè. Bấm chuyển bài liên tục để rèn phản xạ tự nhiên!',
    tab_data: { milestone: 'Campfire Rehearsal' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-20',
    course_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    module_index: 20,
    title: 'Giờ 20: TỐT NGHIỆP - Xuất Thẻ Chứng Nhận Commit 20',
    deliverable_milestone: 'Nộp bản thu tốt nghiệp & xuất thẻ Story 9:16 Flex mạng xã hội',
    instructions_markdown: 'CHÚC MỪNG BẠN! Bạn đã hoàn thành 20 giờ cam kết. Thu âm bài thi và nhận ngay Thẻ Thành Quả Story có mã QR để flex lên TikTok / Facebook!',
    tab_data: { milestone: 'GRADUATION CERTIFICATE' },
    submission_type: 'audio',
    created_at: new Date().toISOString(),
  },
]

export const COURSES_MOCK: Course[] = [
  {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    slug: 'guitar-3-songs',
    title: 'Đệm hát 3 bài Guitar đốt lửa trại sau 20 giờ',
    description: 'Chỉ tập trung 4 hợp âm cốt lõi (C - G - Am - F) và cách quạt nhịp 4/4 để đệm hát mượt mà 3 bài hát quen thuộc không cần nhạc lý hàn lâm.',
    category: 'music',
    target_deliverable: 'Tự đệm hát trọn vẹn 3 bài: Tuổi Hồng Thơ Ngây, Nàng Thơ, Bông Hoa Đẹp Nhất',
    duration_tier: '20h',
    simulator_type: 'guitar',
    simulator_config: {
      allowed_chords: ['Am', 'C', 'G', 'Em', 'Fmaj7', 'Dm'],
      default_bpm: 80,
      default_fret_zoom: 4,
      songs: [
        { title: 'Tuổi Hồng Thơ Ngây', chords: ['Am', 'C', 'G', 'Em'], tempo: 75 },
        { title: 'Nàng Thơ', chords: ['C', 'G', 'Am', 'Fmaj7'], tempo: 82 },
        { title: 'Bông Hoa Đẹp Nhất', chords: ['Am', 'Fmaj7', 'C', 'G'], tempo: 88 },
      ],
    },
    is_published: true,
    view_count: 5120,
    enroll_count: 1420,
    thumbnail_url: '/assets/guitar-hero.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules: INITIAL_GUITAR_MODULES,
  },
  {
    id: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    slug: 'sing-chinese-pop',
    title: 'Hát chuẩn 1 bài Pop tiếng Trung sau 20 giờ',
    description: 'Làm chủ phát âm Pinyin chuẩn xác, luyến láy giai điệu và cao độ bài hát hit "Phi Điểu Và Ve Sầu" sau 20 giờ luyện tập với máy đo cao độ.',
    category: 'language',
    target_deliverable: 'Bản thu âm hát chuẩn Pinyin & đúng cao độ bài Phi Điểu Và Ve Sầu',
    duration_tier: '20h',
    simulator_type: 'voice-pitch',
    simulator_config: {
      song_title: 'Phi Điểu Và Ve Sầu (飞鸟和蝉)',
      artist: 'Nhậm Nhiên (Ren Ran)',
      key: 'C Major',
      bpm: 76,
      pinyin_lyrics: 'Nǐ shì fēiniǎo wǒ shì chán, kànzhe nǐ fēixiàng tiānbiān',
    },
    is_published: true,
    view_count: 3890,
    enroll_count: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules: [],
  },
  {
    id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    slug: 'prompt-ai-sprint',
    title: 'Thần thục Prompt AI tạo ảnh & bài viết sau 5 giờ',
    description: 'Xây dựng bộ prompt Midjourney / ChatGPT chuẩn xác để tạo ngay bộ ảnh thiết kế và tự động hóa viết content cho doanh nghiệp cá nhân.',
    category: 'tech',
    target_deliverable: 'Bộ sưu tập 10 ảnh thiết kế thương hiệu & 5 kịch bản tự động hóa viết bài',
    duration_tier: '5h',
    simulator_type: 'prompt-ai',
    simulator_config: {},
    is_published: true,
    view_count: 2450,
    enroll_count: 670,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules: [],
  },
]

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const found = COURSES_MOCK.find((c) => c.slug === slug)
  return found || null
}

export async function getAllPublishedCourses(): Promise<Course[]> {
  return COURSES_MOCK.filter((c) => c.is_published)
}

export async function getCourseModules(courseId: string): Promise<CourseModule[]> {
  const course = COURSES_MOCK.find((c) => c.id === courseId)
  return course?.modules || []
}
