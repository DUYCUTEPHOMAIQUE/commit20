'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { COURSES_MOCK } from '@/lib/courses-data'
import { Course } from '@/types/database'
import {
  ArrowLeft,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Play,
  Sparkles,
  Users,
  Eye,
  Sliders,
} from 'lucide-react'

export default function StudioPage() {
  const [courses] = useState<Course[]>(COURSES_MOCK)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://commit20.com'
    const fullUrl = `${origin}/c/${slug}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col selection:bg-[#FE7141]/30">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-30 h-16 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="cursor-pointer p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            aria-label="Về trang chủ"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <Image
              src="/icon-192.png"
              alt="Commit 20"
              width={28}
              height={28}
              className="rounded-lg shadow-sm"
            />
            <span className="font-extrabold text-sm sm:text-base tracking-tight uppercase">
              Creator Studio
            </span>
          </div>
        </div>

        <Link
          href="/studio/new"
          className="cursor-pointer px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#FE7141]/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Khóa Mới</span>
        </Link>
      </header>

      {/* 2. Main Content Stage */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Intro Banner (No vanity charts) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#FE7141]" />
              <span className="text-xs font-bold text-[#FE7141] uppercase tracking-wider">
                Xuất Bản Kỹ Năng Đột Phá
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Khóa Học & Môi Trường Luyện Tập Của Bạn
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Mỗi khóa học được gắn sẵn một Simulator tương tác (Đàn ảo, Voice Pitch, AI Prompt) để học viên gảy và thực hành nghe kết quả tức thì.
            </p>
          </div>

          <Link
            href="/studio/new"
            className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-black text-xs sm:text-sm hover:bg-neutral-200 transition-colors shrink-0"
          >
            <span>+ Tạo Khóa Học Ngay</span>
          </Link>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
              Danh Sách Khóa Học Đang Hoạt Động ({courses.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => {
              const isCopied = copiedSlug === course.slug
              return (
                <div
                  key={course.id}
                  className="rounded-2xl bg-neutral-950 border border-neutral-800/90 hover:border-neutral-700/80 p-5 flex flex-col justify-between transition-colors shadow-lg"
                >
                  <div>
                    {/* Badges Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full bg-[#FE7141]/20 text-[#FE7141] text-[11px] font-bold border border-[#FE7141]/30">
                          {course.duration_tier}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-neutral-900 text-neutral-300 text-[11px] font-semibold border border-neutral-800 uppercase">
                          Simulator: {course.simulator_type}
                        </span>
                      </div>

                      <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                        Đang công khai
                      </span>
                    </div>

                    {/* Title & Deliverable */}
                    <h3 className="font-bold text-base sm:text-lg text-white leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Target Deliverable Badge */}
                    <div className="mt-3 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-xs text-neutral-300">
                      <span className="font-semibold text-neutral-200 block text-[11px] mb-0.5">
                        Cam kết đầu ra:
                      </span>
                      <span className="text-neutral-400">{course.target_deliverable}</span>
                    </div>

                    {/* Metrics Row */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-neutral-900 text-xs text-neutral-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{course.enroll_count} học viên</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{course.view_count} lượt xem</span>
                      </span>
                      <span>{course.modules?.length || 20} giờ học</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center gap-2">
                    {/* Direct Play Workspace */}
                    <Link
                      href={`/c/${course.slug}`}
                      className="cursor-pointer flex-1 py-2.5 px-3 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all text-center"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Vào Luyện Tập 🎸</span>
                    </Link>

                    {/* Copy Public Link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(course.slug)}
                      className="cursor-pointer py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      title="Sao chép link chia sẻ công khai"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Đã chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Link Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
