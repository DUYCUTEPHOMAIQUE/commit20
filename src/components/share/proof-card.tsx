'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import {
  X,
  Download,
  Share2,
  Check,
  Play,
  Pause,
  Award,
  Sparkles,
  QrCode,
  Flame,
} from 'lucide-react'

interface ProofCardProps {
  isOpen: boolean
  onClose: () => void
  learnerName?: string
  courseTitle?: string
  completedHours?: number
  audioUrl?: string | null
  courseSlug?: string
}

export default function ProofCard({
  isOpen,
  onClose,
  learnerName = 'Học Viên Cam Kết',
  courseTitle = 'Đệm hát 3 bài Guitar đốt lửa trại',
  completedHours = 20,
  audioUrl,
  courseSlug = 'guitar-3-songs',
}: ProofCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setIsPlaying(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://commit20.com'
    const shareUrl = `${origin}/c/${courseSlug}?ref=graduation`
    navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-250">
        {/* Close Button at top right */}
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer self-end mb-2 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          aria-label="Đóng thẻ thành quả"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 9:16 Vertical Story Proof Card */}
        <div
          ref={cardRef}
          className="relative w-full aspect-[9/16] max-h-[640px] rounded-3xl overflow-hidden border border-neutral-700/80 bg-gradient-to-b from-[#181412] via-[#0E0C0B] to-[#1A1412] p-6 flex flex-col justify-between text-white shadow-2xl"
          style={{
            boxShadow: '0 25px 60px -15px rgba(254,113,65,0.3), inset 0 1px 2px rgba(255,255,255,0.15)',
          }}
        >
          {/* Top Brand & Badge */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon-192.png"
                  alt="Commit 20"
                  width={32}
                  height={32}
                  className="rounded-xl shadow-md"
                />
                <span className="font-black text-sm tracking-tight uppercase">
                  Commit 20
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-[#FE7141]/20 border border-[#FE7141]/40 text-[#FE7141] font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>CHỨNG NHẬN ĐẦU RA</span>
              </div>
            </div>

            {/* Learner Info */}
            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FE7141] to-amber-400 text-black font-black text-lg flex items-center justify-center shadow-lg shadow-[#FE7141]/30">
                {learnerName.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white leading-tight">
                  {learnerName}
                </h3>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                  <Flame className="w-3 h-3 text-[#FE7141] fill-[#FE7141]" />
                  <span>Hoàn thành xuất sắc {completedHours} Giờ</span>
                </span>
              </div>
            </div>

            {/* Skill Title Block */}
            <div className="mt-5 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Kỹ Năng Đã Chinh Phục:
              </span>
              <h2 className="font-black text-lg text-white leading-tight">
                {courseTitle}
              </h2>
            </div>
          </div>

          {/* Center: Audio Waveform Deliverable */}
          <div className="my-auto p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800/90 text-center space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Bản Thu Âm Tốt Nghiệp
              </span>
              <span className="text-[10px] font-mono text-neutral-500">00:30</span>
            </div>

            {/* Waveform Bars */}
            <div className="flex items-center justify-center gap-1 h-10 px-2">
              {[40, 65, 85, 45, 95, 70, 50, 80, 100, 60, 45, 75, 90, 55, 35, 70, 95, 80, 50, 65].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-[#FE7141] animate-pulse' : 'bg-neutral-700'
                  }`}
                  style={{ height: `${isPlaying ? Math.max(15, Math.round(h * Math.random())) : h}%` }}
                />
              ))}
            </div>

            {/* Play Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="cursor-pointer mx-auto px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold flex items-center gap-1.5 border border-neutral-800 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Dừng Nghe</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Nghe Bản Thu Của Tôi 🎸</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom QR Code & Referral Deep-link */}
          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white">
                Thử Sức Cùng Tôi Tại:
              </span>
              <span className="text-[10px] text-[#FE7141] font-mono font-bold mt-0.5">
                commit20.com/c/{courseSlug}
              </span>
              <span className="text-[9px] text-neutral-500 mt-0.5">
                Quét mã để gảy đàn ảo tức thì
              </span>
            </div>

            <div className="w-14 h-14 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md">
              <QrCode className="w-12 h-12 text-black" />
            </div>
          </div>
        </div>

        {/* Share Actions Bar */}
        <div className="mt-3 w-full grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="cursor-pointer py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{isCopied ? 'Đã Chép Link!' : 'Chia Sẻ Story'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="cursor-pointer py-3 px-4 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#FE7141]/25 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Tải Ảnh Story 9:16</span>
          </button>
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
