'use client'

import { useState, useEffect } from 'react'
import { AuthModal } from '@/components/auth/auth-modal'

interface SkillOption {
  id: string
  name: string
  category: string
  hours: number
  deliverable: string
  outcomeHighlight: string
}

const SKILL_OPTIONS: SkillOption[] = [
  {
    id: 'guitar',
    name: 'Đệm hát Guitar 4 hợp âm cơ bản',
    category: 'Âm nhạc',
    hours: 20,
    deliverable: 'Video 1 take vừa đàn vừa hát trọn vẹn 1 bài, bấm êm các hợp âm C-G-Am-F',
    outcomeHighlight: 'Hát đệm mượt mà không bị ngập ngừng ở điệp khúc',
  },
  {
    id: 'chinese',
    name: 'Hát chuẩn bài tiếng Trung Ánh Trăng Nói Hộ Lòng Tôi',
    category: 'Ngoại ngữ',
    hours: 20,
    deliverable: 'Bản thu âm hát mộc trên nền beat karaoke đúng 4 thanh điệu chuẩn Bắc Kinh',
    outcomeHighlight: 'Phát âm tròn chữ, tự tin biểu diễn trước bạn bè',
  },
  {
    id: 'sleep',
    name: 'Thiết lập không gian & nhật ký ngủ sâu 8 tiếng',
    category: 'Phong cách sống',
    hours: 1,
    deliverable: 'Bản sơ đồ Hang Ngủ tối ưu + Nhật ký xả tải não (Brain Dump) 7 ngày',
    outcomeHighlight: 'Chìm vào giấc ngủ trong 15 phút, tỉnh dậy sảng khoái',
  },
  {
    id: 'prompt-ai',
    name: 'Tự động hóa luồng làm việc với Prompt AI',
    category: 'Công nghệ',
    hours: 5,
    deliverable: 'Hệ thống tự động tóm tắt email và trích xuất dữ liệu báo cáo hàng tuần',
    outcomeHighlight: 'Tiết kiệm 5-7 giờ làm việc thủ công mỗi tuần',
  },
  {
    id: 'cooking',
    name: 'Nấu thành thạo 5 mâm cơm gia đình truyền thống',
    category: 'Ẩm thực',
    hours: 20,
    deliverable: 'Album 5 mâm cơm hoàn chỉnh chuẩn vị Bắc - Trung - Nam',
    outcomeHighlight: 'Thao tác dao bếp an toàn, nắm vững tỷ lệ nêm nếm vàng',
  },
  {
    id: 'video',
    name: 'Dựng & xuất 3 video ngắn CapCut chuyên nghiệp',
    category: 'Sáng tạo',
    hours: 5,
    deliverable: '3 video ngắn hoàn chỉnh với nhịp âm thanh, phím tắt và phụ đề tự động',
    outcomeHighlight: 'Xuất bản video chuẩn tỷ lệ 9:16 sẵn sàng đăng TikTok/Reels',
  },
]

export function SkillCalculator() {
  const [selectedSkillId, setSelectedSkillId] = useState<string>('guitar')
  const [dailyMinutes, setDailyMinutes] = useState<number>(60)
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

  const selectedSkill =
    SKILL_OPTIONS.find((s) => s.id === selectedSkillId) || SKILL_OPTIONS[0]

  const [formattedDate, setFormattedDate] = useState<string>('')

  // Calculate target date safely on client
  const totalMinutes = selectedSkill.hours * 60
  const totalDays = Math.ceil(totalMinutes / dailyMinutes)

  useEffect(() => {
    const target = new Date()
    target.setDate(target.getDate() + totalDays)
    setFormattedDate(
      target.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    )
  }, [totalDays])

  return (
    <section id="calculator" className="scroll-mt-24 bg-zinc-100 dark:bg-black py-24 px-6 sm:px-8 text-zinc-900 dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-zinc-950 dark:text-white">
            Máy Tính Mục Tiêu Của Bạn
          </h2>
          <p className="mt-4 text-xl text-zinc-700 dark:text-zinc-400 leading-relaxed">
            Chọn kỹ năng bạn muốn chinh phục và lượng thời gian bạn có thể cam kết mỗi ngày. Chúng tôi tính chính xác ngày bạn đạt kết quả.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              {/* 1. Select Skill */}
              <div className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                1. Chọn kỹ năng mục tiêu
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={`p-4 text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none ${
                      selectedSkillId === skill.id
                        ? 'bg-[#fe7141] text-black font-black'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-750 font-bold'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm mb-1.5 opacity-90">
                      <span>{skill.category}</span>
                      <span>{skill.hours} Giờ</span>
                    </div>
                    <div className="text-base leading-snug">{skill.name}</div>
                  </button>
                ))}
              </div>

              {/* 2. Select Daily Pace */}
              <div className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                2. Cam kết thời gian mỗi ngày
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDailyMinutes(30)}
                  className={`py-3.5 px-3 text-center text-sm font-bold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none ${
                    dailyMinutes === 30
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-black'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  30 phút / ngày
                </button>
                <button
                  type="button"
                  onClick={() => setDailyMinutes(60)}
                  className={`py-3.5 px-3 text-center text-sm font-bold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none ${
                    dailyMinutes === 60
                      ? 'bg-[#fe7141] text-black font-black'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  60 phút / ngày
                </button>
                <button
                  type="button"
                  onClick={() => setDailyMinutes(120)}
                  className={`py-3.5 px-3 text-center text-sm font-bold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none ${
                    dailyMinutes === 120
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-black'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  120 phút / ngày
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 text-sm text-zinc-500 dark:text-zinc-400">
              Công thức 15/45: Mỗi 60 phút gồm 15 phút bài học vi mô và 45 phút bấm giờ thao tác trực tiếp.
            </div>
          </div>

          {/* Outcome Projection Column */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-950 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-zinc-950 dark:text-white leading-tight mb-2">
                {totalDays === 1 ? 'Chỉ 1 Buổi Tối' : `Sau ${totalDays} Ngày`}
              </div>

              <div className="text-base font-semibold text-zinc-600 dark:text-zinc-300 capitalize mb-6 min-h-[24px]">
                {formattedDate ? `Dự kiến về đích: ${formattedDate}` : `Thời gian cam kết: ${totalDays} ngày`}
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-5 bg-zinc-100 dark:bg-zinc-900">
                  <div className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Sản phẩm đầu ra cầm tay:
                  </div>
                  <div className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
                    {selectedSkill.deliverable}
                  </div>
                </div>

                <div className="p-5 bg-zinc-100 dark:bg-zinc-900">
                  <div className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Ngưỡng năng lực MVS:
                  </div>
                  <div className="text-base font-medium text-zinc-800 dark:text-zinc-300 leading-snug">
                    {selectedSkill.outcomeHighlight}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="w-full py-4 bg-[#fe7141] text-black font-black text-base hover:bg-[#ff8559] active:scale-[0.99] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:outline-none"
              >
                Khóa Mục Tiêu & Bắt Đầu Ngay →
              </button>
              <div className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Không thu phí thẻ tín dụng · Bắt đầu miễn phí bài học đầu tiên
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultSkill={selectedSkill.name}
      />
    </section>
  )
}
