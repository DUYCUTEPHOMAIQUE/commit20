'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Course } from '@/types/database'
import GuitarSimulator from '@/components/simulator/guitar/guitar-simulator'
import GuideDrawer from '@/components/workspace/guide-drawer'
import SubmissionModal from '@/components/workspace/submission-modal'
import ProofCard from '@/components/share/proof-card'
import {
  ArrowLeft,
  BookOpen,
  Mic,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  Award,
} from 'lucide-react'

interface WorkspaceClientProps {
  initialCourse: Course
  slug: string
}

export default function WorkspaceClient({ initialCourse, slug }: WorkspaceClientProps) {
  const [course] = useState<Course>(initialCourse)
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(1)
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false)
  const [isSubmissionOpen, setIsSubmissionOpen] = useState<boolean>(false)
  const [isProofCardOpen, setIsProofCardOpen] = useState<boolean>(false)
  const [completedModules, setCompletedModules] = useState<number[]>([])

  const modules = course.modules || []
  const currentModule = modules.find((m) => m.module_index === currentModuleIndex) || modules[0]
  const totalHours = modules.length || 20

  const handleNextHour = () => {
    if (currentModuleIndex < totalHours) {
      setCurrentModuleIndex((prev) => prev + 1)
    }
  }

  const handlePrevHour = () => {
    if (currentModuleIndex > 1) {
      setCurrentModuleIndex((prev) => prev - 1)
    }
  }

  const handleSubmissionSuccess = () => {
    if (!completedModules.includes(currentModuleIndex)) {
      setCompletedModules((prev) => [...prev, currentModuleIndex])
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0A0A0A] text-neutral-100 selection:bg-[#FE7141]/30">
      {/* 1. Header Toolbar (Ergonomic 56px height) */}
      <header className="sticky top-0 z-30 h-14 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-3 sm:px-6 flex items-center justify-between">
        {/* Back Link & Brand */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="cursor-pointer p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            aria-label="Về trang chủ"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <Image
              src="/icon-192.png"
              alt="Commit 20"
              width={26}
              height={26}
              className="rounded-lg shadow-sm"
            />
            <div className="flex flex-col">
              <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[180px] sm:max-w-md">
                {course.title}
              </h1>
              <span className="text-[10px] text-neutral-500 font-medium hidden sm:inline">
                {course.target_deliverable}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Controls & Hour Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hour Navigator */}
          <div className="flex items-center rounded-xl bg-neutral-900 border border-neutral-800 p-0.5">
            <button
              type="button"
              onClick={handlePrevHour}
              disabled={currentModuleIndex <= 1}
              className="cursor-pointer p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Giờ trước đó"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-xs font-bold text-[#FE7141] font-mono">
              {currentModuleIndex}/{totalHours}h
            </span>

            <button
              type="button"
              onClick={handleNextHour}
              disabled={currentModuleIndex >= totalHours}
              className="cursor-pointer p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Giờ tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Proof Certificate Button & Streak Badge */}
          <button
            type="button"
            onClick={() => setIsProofCardOpen(true)}
            className="cursor-pointer px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-400 text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
            title="Xem Thẻ Chứng Nhận Tốt Nghiệp Flex Story"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flex </span>Chứng Nhận
          </button>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Streak: {completedModules.length}h</span>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Body */}
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-[320px_1fr] max-w-7xl mx-auto w-full p-3 sm:p-5 gap-4">
        {/* Left Column (Desktop Syllabus & Guidance) */}
        <div className="hidden lg:flex flex-col gap-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Current Hour Overview */}
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="px-2 py-0.5 rounded-md bg-[#FE7141]/20 text-[#FE7141] text-[11px] font-bold border border-[#FE7141]/30 inline-block mb-1.5">
              Giờ {currentModule?.module_index || 1}: Đang Luyện Tập
            </span>
            <h2 className="font-bold text-white text-base leading-snug">
              {currentModule?.title}
            </h2>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              {currentModule?.instructions_markdown}
            </p>
          </div>

          {/* Milestone Box */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-emerald-500/30 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Mục Tiêu Giờ Này
              </span>
              <p className="text-xs font-medium text-white mt-0.5">
                {currentModule?.deliverable_milestone}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="cursor-pointer py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FE7141]" />
              <span>Xem Video</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSubmissionOpen(true)}
              className="cursor-pointer py-2.5 px-3 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#FE7141]/25 active:scale-95"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Nộp Bài</span>
            </button>
          </div>

          {/* 20 Hours List */}
          <div className="mt-2 pt-3 border-t border-neutral-800">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
              Lộ Trình 20 Giờ Thực Chiến
            </span>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {modules.map((m) => {
                const isCurrent = m.module_index === currentModuleIndex
                const isCompleted = completedModules.includes(m.module_index)
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCurrentModuleIndex(m.module_index)}
                    className={`cursor-pointer w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-[#FE7141]/20 text-[#FE7141] font-bold border border-[#FE7141]/40'
                        : isCompleted
                        ? 'text-neutral-400 bg-neutral-900/50 hover:bg-neutral-900'
                        : 'text-neutral-500 hover:bg-neutral-900/80 hover:text-neutral-300'
                    }`}
                  >
                    <span className="truncate max-w-[210px]">
                      {m.module_index}. {m.title.replace(/^Giờ \d+:\s*/, '')}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-600">60p</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Simulator Canvas (Mobile-First Stage) */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Mobile Current Milestone Strip */}
          <div className="lg:hidden flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs mb-2">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="px-2 py-0.5 rounded-md bg-[#FE7141]/20 text-[#FE7141] font-bold text-[10px] shrink-0">
                G.{currentModuleIndex}
              </span>
              <span className="font-semibold text-white truncate">
                {currentModule?.deliverable_milestone}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="cursor-pointer text-[11px] font-bold text-[#FE7141] shrink-0 hover:underline"
            >
              Mẹo ngón
            </button>
          </div>

          {/* The Interactive Guitar Simulator */}
          <div className="flex-1 flex items-center justify-center">
            <GuitarSimulator
              initialChord="Am"
              allowedChords={['Am', 'C', 'G', 'Em', 'Fmaj7', 'Dm']}
              defaultBpm={80}
            />
          </div>

          {/* Mobile Bottom Sticky Action Bar */}
          <div className="lg:hidden sticky bottom-2 mt-3 z-20 grid grid-cols-2 gap-2 bg-neutral-950/95 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="cursor-pointer py-3 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-neutral-800 active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-[#FE7141]" />
              <span>Xem Hướng Dẫn</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSubmissionOpen(true)}
              className="cursor-pointer py-3 px-3 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 active:bg-[#FE7141]/80 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-[#FE7141]/30 transition-all active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Nộp Bài Giờ {currentModuleIndex}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Guide Drawer Bottom Sheet */}
      <GuideDrawer
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        module={currentModule}
        totalHours={totalHours}
      />

      {/* In-Browser Submission Modal */}
      <SubmissionModal
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
        module={currentModule}
        totalHours={totalHours}
        onSuccess={handleSubmissionSuccess}
      />

      {/* Graduation Proof-of-Work Card (Story 9:16) */}
      <ProofCard
        isOpen={isProofCardOpen}
        onClose={() => setIsProofCardOpen(false)}
        courseTitle={course.title}
        courseSlug={slug}
        completedHours={completedModules.length || 20}
      />
    </div>
  )
}
