'use client'

import { useState } from 'react'

export function InteractivePracticePreview() {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('practice')
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(45 * 60)

  const toggleTimer = () => setIsRunning(!isRunning)
  const resetTimer = () => {
    setIsRunning(false)
    setSeconds(45 * 60)
  }

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white transition-colors">
      {/* Tab Switcher */}
      <div className="flex bg-zinc-200 dark:bg-black">
        <button
          type="button"
          onClick={() => setActiveTab('learn')}
          className={`px-8 py-5 text-sm font-black uppercase tracking-tight cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none ${
            activeTab === 'learn'
              ? 'bg-[#fe7141] text-black'
              : 'text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          15 Phút Bài Học Vi Mô
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('practice')}
          className={`px-8 py-5 text-sm font-black uppercase tracking-tight cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none ${
            activeTab === 'practice'
              ? 'bg-[#fe7141] text-black'
              : 'text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          45 Phút Thực Hành Có Chủ Đích
        </button>
      </div>

      <div className="p-8 sm:p-12">
        {activeTab === 'learn' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-video bg-zinc-200 dark:bg-black flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-[#fe7141] text-black font-black text-2xl flex items-center justify-center">
                ▶
              </div>
              <div className="mt-4 text-base font-bold text-zinc-800 dark:text-zinc-300">
                Bài học 08:30 • Kỹ thuật bấm hợp âm Fmaj7 không rè tiếng
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white leading-tight">
                Học vừa đủ để tự nhận ra lỗi sai
              </h3>
              <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Không xem hàng giờ lý thuyết. Bạn chỉ học một mẹo ngón neo (Anchor Finger) để ngón tay không bị đơ khi chuyển giữa các hợp âm.
              </p>

              <div className="mt-6 space-y-3">
                <div className="p-4 bg-white dark:bg-black text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                  Cách nhận biết ngón tay bị chạm dây dưới gây rè tiếng
                </div>
                <div className="p-4 bg-white dark:bg-black text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                  Quy tắc nhấc từng ngón để hình thành trí nhớ cơ bắp
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                className="mt-8 px-6 py-3.5 bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-black text-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none"
              >
                Chuyển sang 45 phút thực hành →
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-zinc-200 dark:bg-black p-10 text-center">
              <div className="text-7xl sm:text-8xl font-black text-[#fe7141] tracking-tighter leading-none">
                {formatTimer(seconds)}
              </div>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                {isRunning ? 'Đang bấm giờ thực hành tích lũy' : 'Nhấn bắt đầu khi bạn đã sẵn sàng cầm đàn'}
              </p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={toggleTimer}
                  className="px-8 py-3.5 bg-[#fe7141] text-black font-black text-base hover:bg-[#ff8559] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
                >
                  {isRunning ? 'Tạm dừng' : 'Bắt đầu bấm giờ'}
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="px-5 py-3.5 bg-zinc-300 text-zinc-800 hover:text-black dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white font-bold text-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none"
                >
                  Đặt lại
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white leading-tight">
                Đo theo từng phút luyện tập thực tế
              </h3>
              <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Hệ thống chỉ tính chuỗi ngày học khi đồng hồ được ghi nhận. Không tính thời gian xem video thụ động.
              </p>

              <div className="mt-6 space-y-3">
                <div className="p-4 bg-white dark:bg-black text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                  15 phút đầu: Chuyển chậm giữa Am và Fmaj7 theo nhịp 40 BPM
                </div>
                <div className="p-4 bg-white dark:bg-black text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                  20 phút giữa: Ghép quạt nhịp 4/4 và dậm chân giữ phách
                </div>
                <div className="p-4 bg-white dark:bg-black text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                  10 phút cuối: Thu âm 1 lần 60 giây để nộp bài nhận xét đồng đẳng
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
