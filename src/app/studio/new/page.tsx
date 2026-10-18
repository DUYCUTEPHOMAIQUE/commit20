'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Music,
  Mic,
  Bot,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { DurationTier, SimulatorType, CourseCategory } from '@/types/database'

export default function NewCourseWizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Step 1: Info & Outcome
  const [title, setTitle] = useState('Đệm hát 3 bài Guitar cơ bản sau 20 giờ')
  const [targetDeliverable, setTargetDeliverable] = useState('Tự đệm hát trọn vẹn 3 bài quen thuộc với 4 hợp âm cơ bản')
  const [durationTier, setDurationTier] = useState<DurationTier>('20h')
  const [category, setCategory] = useState<CourseCategory>('music')

  // Step 2: Simulator Engine
  const [simulatorType, setSimulatorType] = useState<SimulatorType>('guitar')
  const [selectedChords, setSelectedChords] = useState<string[]>(['Am', 'C', 'G', 'Em', 'Fmaj7', 'Dm'])

  // Step 3: Modules Outline
  const [modules, setModules] = useState<Array<{ hour: number; milestone: string }>>([
    { hour: 1, milestone: 'Làm quen cần đàn & Thế bấm hợp âm Am chuẩn' },
    { hour: 2, milestone: 'Chuyển mượt mà giữa Am và C trong 4 nhịp' },
    { hour: 3, milestone: 'Luyện nhịp Down-strum cùng Metronome 60BPM' },
    { hour: 4, milestone: 'Thế bấm hợp âm Em (Mi Thứ) siêu dễ' },
    { hour: 5, milestone: 'Hợp âm G (Sol Trưởng) tròn tiếng' },
  ])

  // Step 4: Publish state
  const [isPublished, setIsPublished] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Generate slug
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-new-skill'

  const handleGenerateOutline = () => {
    const hoursCount = durationTier === '1h' ? 1 : durationTier === '5h' ? 5 : 20
    const generated: Array<{ hour: number; milestone: string }> = []
    for (let i = 1; i <= hoursCount; i++) {
      if (i === 1) generated.push({ hour: 1, milestone: 'Làm quen thế bấm ngón nền tảng & gảy sạch nốt' })
      else if (i === Math.floor(hoursCount / 2)) generated.push({ hour: i, milestone: `Hoàn thiện bài tập chuyển hợp âm và quạt nhịp milestone ${i}` })
      else if (i === hoursCount) generated.push({ hour: i, milestone: 'TỐT NGHIỆP: Thu âm trọn vẹn sản phẩm hoàn chỉnh để nhận chứng nhận' })
      else generated.push({ hour: i, milestone: `Luyện tập kỹ thuật & chuyển phách giờ ${i}` })
    }
    setModules(generated)
  }

  const handlePublish = () => {
    setIsPublished(true)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col selection:bg-[#FE7141]/30">
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-30 h-16 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="cursor-pointer p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight">
              Tạo Khóa Học Mới
            </span>
          </div>
        </div>

        {/* Wizard Stepper Dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                currentStep === step
                  ? 'bg-[#FE7141] text-white ring-2 ring-[#FE7141]/40'
                  : currentStep > step
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
              }`}
            >
              {currentStep > step ? '✓' : step}
            </div>
          ))}
        </div>
      </header>

      {/* 2. Main Wizard Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-between">
        {isPublished ? (
          // Published Success Card
          <div className="my-auto p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-neutral-800 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-white">
              Khóa Học Đã Xuất Bản Thành Công! 🎉
            </h2>

            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Học viên có thể truy cập ngay vào link công khai dưới đây để trải nghiệm đàn ảo và nộp sản phẩm trực tiếp:
            </p>

            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2 max-w-md mx-auto">
              <span className="text-xs font-mono font-bold text-[#FE7141] truncate px-2">
                commit20.com/c/{slug}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`https://commit20.com/c/${slug}`)
                  setCopiedLink(true)
                  setTimeout(() => setCopiedLink(false), 2000)
                }}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Đã Chép' : 'Sao Chép'}</span>
              </button>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/c/guitar-3-songs`}
                className="cursor-pointer px-6 py-3 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 text-white font-bold text-sm shadow-lg shadow-[#FE7141]/25 flex items-center justify-center gap-2"
              >
                <span>Mở Luyện Tập Thử Ngay 🎸</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                href="/studio"
                className="cursor-pointer px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-sm border border-neutral-800 flex items-center justify-center"
              >
                Về Quản Lý Khóa Học
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* STEP 1: Title & Outcome */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold text-[#FE7141] uppercase tracking-wider block mb-1">
                    Bước 1/4: Mục Tiêu & Cam Kết Đầu Ra
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Bạn Dạy Kỹ Năng Gì Cho Người Học?
                  </h2>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-400 block mb-1.5">
                    Tiêu Đề Khóa Học (Công thức: Động từ + Kỹ năng + Thời lượng)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Đệm hát 3 bài Guitar đốt lửa trại sau 20 giờ"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#FE7141]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-400 block mb-1.5">
                    Cam Kết Sản Phẩm Đầu Ra (Target Deliverable)
                  </label>
                  <textarea
                    rows={2}
                    value={targetDeliverable}
                    onChange={(e) => setTargetDeliverable(e.target.value)}
                    placeholder="Ví dụ: Tự đệm hát trọn vẹn 3 bài Tuổi Hồng Thơ Ngây, Nàng Thơ..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#FE7141]"
                  />
                </div>

                {/* Duration Tier */}
                <div>
                  <label className="text-xs font-bold text-neutral-400 block mb-1.5">
                    Khung Thời Lượng Cam Kết
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { tier: '20h', label: '20 Giờ', desc: 'Thần thục 1 kỹ năng' },
                      { tier: '5h', label: '5 Giờ', desc: 'Sprint nhanh' },
                      { tier: '1h', label: '1 Giờ', desc: 'Life hack cấp tốc' },
                    ].map((item) => (
                      <button
                        key={item.tier}
                        type="button"
                        onClick={() => setDurationTier(item.tier as DurationTier)}
                        className={`cursor-pointer p-3 rounded-xl border text-left transition-all ${
                          durationTier === item.tier
                            ? 'bg-[#FE7141]/15 border-[#FE7141] text-white ring-1 ring-[#FE7141]/40'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <span className="font-extrabold text-sm block text-white">{item.label}</span>
                        <span className="text-[11px] text-neutral-500 mt-0.5 block">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Choose Simulator */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold text-[#FE7141] uppercase tracking-wider block mb-1">
                    Bước 2/4: Chọn Simulator Luyện Tập
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Gắn Môi Trường Thực Hành Ảo
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Mỗi kỹ năng cần một môi trường ảo để học viên thao tác và nghe thấy kết quả tức thì không cần mua nhạc cụ đắt tiền.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'guitar',
                      title: '🎸 Guitar Virtual Fretboard',
                      desc: 'Cần đàn ảo 4 ngăn phím Web Audio + Bàn quạt ngón cái + Máy đếm nhịp',
                    },
                    {
                      id: 'voice-pitch',
                      title: '🎤 Voice Pitch & Pinyin Tracker',
                      desc: 'Máy đo cao độ giọng hát + hiển thị lời phiên âm Pinyin/Lời bài hát',
                    },
                    {
                      id: 'prompt-ai',
                      title: '🤖 Prompt AI Sandbox',
                      desc: 'Hộp thoại thử nghiệm prompt hình ảnh Midjourney và ChatGPT tự động',
                    },
                  ].map((sim) => (
                    <div
                      key={sim.id}
                      onClick={() => setSimulatorType(sim.id as SimulatorType)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                        simulatorType === sim.id
                          ? 'bg-[#FE7141]/15 border-[#FE7141] text-white ring-1 ring-[#FE7141]/40'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-white">{sim.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1">{sim.desc}</p>
                    </div>
                  ))}
                </div>

                {simulatorType === 'guitar' && (
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <span className="text-xs font-bold text-white block">
                      Các Hợp Âm Cho Phép Sử Dụng Trong Khóa Này:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Am', 'C', 'G', 'Em', 'Fmaj7', 'Dm'].map((chord) => {
                        const isChecked = selectedChords.includes(chord)
                        return (
                          <button
                            key={chord}
                            type="button"
                            onClick={() => {
                              setSelectedChords((prev) =>
                                isChecked ? prev.filter((c) => c !== chord) : [...prev, chord]
                              )
                            }}
                            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                              isChecked
                                ? 'bg-[#FE7141] text-white'
                                : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                            }`}
                          >
                            {chord}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Outline Modules */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#FE7141] uppercase tracking-wider block mb-1">
                      Bước 3/4: Lộ Trình Giờ Học ({durationTier})
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Xác Lập Mục Tiêu Từng Giờ
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateOutline}
                    className="cursor-pointer px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#FE7141] font-bold text-xs border border-neutral-800 flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tạo Mẫu Tự Động</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {modules.map((m, idx) => (
                    <div
                      key={m.hour}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3 text-xs"
                    >
                      <span className="w-6 h-6 rounded-md bg-[#FE7141]/20 text-[#FE7141] font-mono font-bold flex items-center justify-center shrink-0">
                        {m.hour}
                      </span>
                      <input
                        type="text"
                        value={m.milestone}
                        onChange={(e) => {
                          const val = e.target.value
                          setModules((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, milestone: val } : item))
                          )
                        }}
                        className="flex-1 bg-transparent border-none text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Preview & Publish */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold text-[#FE7141] uppercase tracking-wider block mb-1">
                    Bước 4/4: Xem Trước & Xuất Bản
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Kiểm Tra Lại Trước Khi Public
                  </h2>
                </div>

                {/* Preview Card */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#FE7141]/20 text-[#FE7141] text-xs font-bold">
                      {durationTier}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-neutral-900 text-neutral-300 text-xs font-semibold border border-neutral-800 uppercase">
                      Simulator: {simulatorType}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white">{title}</h3>
                  <p className="text-xs text-neutral-400">{targetDeliverable}</p>
                  <div className="pt-2 border-t border-neutral-900 text-xs text-neutral-500">
                    Đường dẫn công khai: <span className="text-white font-mono">commit20.com/c/{slug}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="cursor-pointer px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300 font-bold text-xs"
              >
                Quay Lại
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FE7141]/25 active:scale-95"
                >
                  <span>Tiếp Tục</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="cursor-pointer px-6 py-2.5 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#FE7141]/30 active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>Xuất Bản Công Khai 🚀</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
