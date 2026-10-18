export type UserRole = 'learner' | 'creator' | 'admin'

export type SprintCategory =
  | 'music'
  | 'language'
  | 'cooking'
  | 'fitness_health'
  | 'productivity_tech'
  | 'art_craft'
  | 'other'

export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url?: string | null
  bio?: string | null
  total_practice_minutes: number
  current_streak_days: number
  last_practice_date?: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Sprint {
  id: string
  creator_id: string
  title: string
  slug: string
  category: SprintCategory
  target_hours: number // 1 to 20
  promise_deliverable: string
  prerequisites?: string | null
  cover_image_url?: string | null
  demo_video_url?: string | null
  is_published: boolean
  enrollment_count: number
  completion_count: number
  created_at: string
  updated_at: string
  // Optional joined creator profile
  creator?: Profile
}

export interface HourlyMilestone {
  id: string
  sprint_id: string
  hour_index: number // 1 to target_hours
  title: string
  guide_markdown: string
  embed_video_url?: string | null
  checklist: string[]
  checkpoint_prompt?: string | null
  created_at: string
}

export type EnrollmentStatus = 'in_progress' | 'completed' | 'abandoned'
export type PaceType = 'daily_1h' | 'weekend_sprint' | 'self_paced'

export interface Enrollment {
  id: string
  user_id: string
  sprint_id: string
  status: EnrollmentStatus
  pace_type: PaceType
  current_hour: number
  total_minutes_practiced: number
  staked_amount: number
  started_at: string
  completed_at?: string | null
  sprint?: Sprint
}

export interface PracticeLog {
  id: string
  enrollment_id: string
  user_id: string
  hour_index: number
  duration_minutes: number
  notes?: string | null
  created_at: string
}

export type MediaType = 'video_embed' | 'audio_embed' | 'image_upload' | 'external_link'

export interface ProofSubmission {
  id: string
  enrollment_id: string
  user_id: string
  sprint_id: string
  is_final_deliverable: boolean
  hour_index?: number | null
  media_type: MediaType
  media_url: string
  reflection?: string | null
  upvotes_count: number
  is_featured: boolean
  created_at: string
  user?: Profile
  sprint?: Sprint
}
