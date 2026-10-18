'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, PlayCircle, CheckCircle2, Lightbulb, ChevronDown } from 'lucide-react'
import { CourseModule } from '@/types/database'

interface GuideDrawerProps {
  isOpen: boolean
  onClose: () => void
  module?: CourseModule
  totalHours?: number
}

export default function GuideDrawer({
  isOpen,
  onClose,
  module,
  totalHours = 20,
}: GuideDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !module) return null

  const content = (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-neutral-900 border-t border-neutral-800 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250">
        {/* Grab Handle */}
        <div className="flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-neutral-700 cursor-pointer hover:bg-neutral-600 transition-colors" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#FE7141]/20 text-[#FE7141] text-xs font-bold border border-[#FE7141]/30">
              Giờ {module.module_index}/{totalHours}
            </span>
            <h3 className="font-bold text-white text-base truncate max-w-[240px]">
              {module.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            aria-label="Đóng hướng dẫn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-4 text-sm text-neutral-300">
          {/* 1. Target Milestone Box */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Mục Tiêu Cần Đạt Giờ Này
              </span>
              <p className="font-semibold text-white mt-0.5">
                {module.deliverable_milestone}
              </p>
            </div>
          </div>

          {/* 2. Micro Video / Demo Preview Placeholder */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center p-4 text-center group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#FE7141] text-white flex items-center justify-center shadow-lg shadow-[#FE7141]/40 group-hover:scale-110 transition-transform">
              <PlayCircle className="w-6 h-6 fill-white text-[#FE7141]" />
            </div>
            <span className="text-xs font-bold text-white mt-2">
              Xem Video Hướng Dẫn Nhanh (90s)
            </span>
            <span className="text-[11px] text-neutral-500">
              Thao tác ngón tay thực tế không lý thuyết thừa
            </span>
          </div>

          {/* 3. Markdown / Step-by-Step Instructions */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Mẹo Ngón Tay & Lưu Ý
              </span>
              <p className="text-neutral-300 leading-relaxed text-xs">
                {module.instructions_markdown}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/95">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer w-full py-3 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 text-white font-bold text-sm shadow-lg shadow-[#FE7141]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Đã Hiểu, Quay Lại Đàn 🎸</span>
          </button>
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
