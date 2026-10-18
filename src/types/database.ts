export type UserRole = 'learner' | 'creator' | 'admin'

export type CourseCategory =
  | 'music'
  | 'language'
  | 'lifestyle'
  | 'tech'
  | 'art'
  | 'soft-skills'
  | 'other'

export type DurationTier = '1h' | '5h' | '20h'

export type SimulatorType = 'guitar' | 'voice-pitch' | 'prompt-ai' | 'sandbox'

export type SubmissionType = 'audio' | 'video' | 'text' | 'file'

export interface GuitarChordConfig {
  chord: string
  frets: number[] // 6 strings, -1 for mute, 0 for open, 1-12 for frets
  fingers?: number[] // finger number 1-4 for each string, 0 for open/mute
}

export interface GuitarSimulatorConfig {
  allowed_chords: string[]
  default_bpm?: number
  default_fret_zoom?: number
  songs?: Array<{
    title: string
    chords: string[]
    tempo: number
  }>
}

export interface VoicePitchSimulatorConfig {
  song_title: string
  artist?: string
  key: string
  bpm: number
  pinyin_lyrics?: string
}

export type SimulatorConfig = GuitarSimulatorConfig | VoicePitchSimulatorConfig | Record<string, unknown>

export interface Course {
  id: string
  slug: string
  title: string
  description?: string | null
  category: CourseCategory
  target_deliverable: string
  duration_tier: DurationTier
  simulator_type: SimulatorType
  simulator_config: SimulatorConfig
  creator_id?: string | null
  is_published: boolean
  view_count: number
  enroll_count: number
  thumbnail_url?: string | null
  created_at: string
  updated_at: string
  modules?: CourseModule[]
}

export interface CourseModule {
  id: string
  course_id: string
  module_index: number // 1 to 20
  title: string
  deliverable_milestone: string
  guide_video_url?: string | null
  instructions_markdown?: string | null
  tab_data?: Record<string, unknown>
  submission_type: SubmissionType
  created_at: string
}

export interface Submission {
  id: string
  user_id?: string | null
  course_id: string
  module_id?: string | null
  media_url: string
  reflection_notes?: string | null
  likes_count: number
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  current_module_index: number
  completed_modules: number[]
  total_practice_seconds: number
  streak_days: number
  last_practiced_at?: string | null
  created_at: string
  course?: Course
}
