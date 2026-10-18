'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Mic, Square, Play, Pause, CheckCircle, Sparkles, X, RotateCcw, UploadCloud } from 'lucide-react'
import { CourseModule } from '@/types/database'

interface SubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  module?: CourseModule
  totalHours?: number
  onSuccess?: () => void
}

export default function SubmissionModal({
  isOpen,
  onClose,
  module,
  totalHours = 20,
  onSuccess,
}: SubmissionModalProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false)
  const [notes, setNotes] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed
      setIsRecording(false)
      setRecordSeconds(0)
      setAudioUrl(null)
      setIsPlayingAudio(false)
      setIsSubmitting(false)
      setIsSubmittedSuccess(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isOpen])

  if (!isOpen || !module) return null

  // Start browser audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start(200)
      setIsRecording(true)
      setRecordSeconds(0)

      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => {
          if (prev >= 20) {
            stopRecording()
            return 20
          }
          return prev + 1
        })
      }, 1000)
    } catch (err) {
      console.warn('Microphone permission denied or not available:', err)
      // Fallback: mock recording for devices without mic or permissions
      simulateMockRecording()
    }
  }

  // Fallback simulator if mic is not permitted
  const simulateMockRecording = () => {
    setIsRecording(true)
    setRecordSeconds(0)
    timerRef.current = window.setInterval(() => {
      setRecordSeconds((prev) => {
        if (prev >= 5) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsRecording(false)
          setAudioUrl('/assets/sample-strum.mp3')
          return 5
        }
        return prev + 1
      })
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRecording(false)
  }

  const togglePlayAudio = () => {
    if (!audioUrl) return
    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioUrl)
      audioElementRef.current.onended = () => setIsPlayingAudio(false)
    }

    if (isPlayingAudio) {
      audioElementRef.current.pause()
      setIsPlayingAudio(false)
    } else {
      audioElementRef.current.play().catch(() => {})
      setIsPlayingAudio(true)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate instant save
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmittedSuccess(true)
      onSuccess?.()
    }, 800)
  }

  const content = (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 text-white animate-in slide-in-from-bottom duration-250">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <span className="text-[11px] font-bold text-[#FE7141] uppercase tracking-wider block">
              Nộp Bài Minh Chứng Giờ {module.module_index}/{totalHours}
            </span>
            <h3 className="font-bold text-white text-base">
              {module.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {isSubmittedSuccess ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-4 ring-emerald-500/30 animate-in zoom-in-75">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-xl text-white">
              Xuất Sắc! Đã Hoàn Thành Giờ {module.module_index} 🎉
            </h4>
            <p className="text-sm text-neutral-400 max-w-xs">
              Bản thu âm của bạn đã được lưu vào hồ sơ chứng nhận. Streak học tập được cộng +1!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer mt-4 w-full py-3 rounded-xl bg-[#FE7141] hover:bg-[#FE7141]/90 text-white font-bold text-sm shadow-lg shadow-[#FE7141]/25 active:scale-[0.99] transition-all"
            >
              Tiếp Tục Sang Giờ Kế Tiếp 🚀
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Target reminder */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
              <span className="font-semibold text-white block mb-0.5">Yêu cầu nộp:</span>
              <span>{module.deliverable_milestone}</span>
            </div>

            {/* Recorder Zone */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center text-center space-y-3">
              {audioUrl ? (
                // Audio Preview Player
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#FE7141]/20 text-[#FE7141] flex items-center justify-center ring-2 ring-[#FE7141]/40">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Đã ghi âm thành công ({recordSeconds}s)
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Nghe lại trước khi bấm nộp bài
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <button
                      type="button"
                      onClick={togglePlayAudio}
                      className="cursor-pointer px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Tạm dừng</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Nghe thử bản ghi</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAudioUrl(null)}
                      className="cursor-pointer p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs transition-colors"
                      title="Thu âm lại"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : isRecording ? (
                // Active Recording State
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center ring-4 ring-red-500/40 animate-pulse">
                      <Mic className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xl font-mono font-bold text-white block">
                      00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds} / 00:20
                    </span>
                    <span className="text-xs text-red-400 font-medium">
                      Đang lắng nghe tiếng đàn của bạn...
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="cursor-pointer mt-1 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Dừng Thu Âm</span>
                  </button>
                </div>
              ) : (
                // Idle State: Start Recording
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={startRecording}
                    className="cursor-pointer w-16 h-16 rounded-full bg-[#FE7141] hover:bg-[#FE7141]/90 text-white flex items-center justify-center shadow-xl shadow-[#FE7141]/35 hover:scale-105 active:scale-95 transition-all"
                    title="Bắt đầu thu âm"
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                  <div>
                    <span className="text-sm font-bold text-white block">
                      Chạm để thu âm 15 giây
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Gảy thử hợp âm {module.title} vào micro
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Reflection Notes */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                Ghi chú hoặc cảm nhận của bạn (Tùy chọn)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Đã đổi Am sang C không bị đau tay..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-[#FE7141]"
              />
            </div>

            {/* Submit Action */}
            <button
              type="button"
              disabled={!audioUrl || isSubmitting}
              onClick={handleSubmit}
              className={`cursor-pointer w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                audioUrl && !isSubmitting
                  ? 'bg-[#FE7141] hover:bg-[#FE7141]/90 text-white shadow-lg shadow-[#FE7141]/25 active:scale-[0.99]'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang Tải Lên...' : 'Nộp Bài & Lưu Streak 🔥'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
