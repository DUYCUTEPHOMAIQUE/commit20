'use client'

import { X, CheckCircle2 } from 'lucide-react'
import { AuthModal } from '@/components/auth/auth-modal'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export interface CurriculumData {
  title: string
  hours: number
  deliverable: string
  phases: {
    phase: string
    title: string
    practiceTime: string
    activities: string[]
    milestone: string
  }[]
}

interface CurriculumModalProps {
  isOpen: boolean
  onClose: () => void
  data: CurriculumData | null
}

export function CurriculumModal({ isOpen, onClose, data }: CurriculumModalProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !data || !mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="curriculum-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white p-6 sm:p-10 my-8 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng lộ trình"
          className="absolute top-6 right-6 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none p-1"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="mb-8 pr-8">
          <div className="inline-block px-3 py-1 bg-[#fe7141] text-black font-black text-sm uppercase mb-3">
            {data.hours} Giờ Thực Hành Có Chủ Đích
          </div>
          <h2 id="curriculum-modal-title" className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            {data.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
            <span className="text-[#fe7141] font-bold">Sản phẩm đầu ra cam kết: </span>
            {data.deliverable}
          </p>
        </div>

        {/* Phases list */}
        <div className="space-y-6 mb-8">
          {data.phases.map((p, idx) => (
            <div key={idx} className="bg-zinc-100 dark:bg-black p-6 border-l-4 border-[#fe7141]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-sm font-black text-[#fe7141] uppercase tracking-wide">
                  {p.phase} • {p.practiceTime}
                </span>
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-900 px-3 py-1">
                  Mốc đạt: {p.milestone}
                </span>
              </div>

              <h3 className="text-lg font-black text-zinc-950 dark:text-white mb-3">
                {p.title}
              </h3>

              <ul className="space-y-2">
                {p.activities.map((act, actIdx) => (
                  <li key={actIdx} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#fe7141] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Modal CTA */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-300 text-center sm:text-left">
            15 phút video + 45 phút bấm giờ mỗi ngày. Đạt ngưỡng MVS chắc chắn.
          </div>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#fe7141] text-black font-black text-sm hover:bg-[#ff8559] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:outline-none"
          >
            Đăng Ký Khóa Học Này →
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          onClose()
        }}
        defaultSkill={data.title}
      />
    </div>,
    document.body
  )
}
