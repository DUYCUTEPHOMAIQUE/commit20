'use client'

import { useState } from 'react'
import { CurriculumModal, CurriculumData } from './curriculum-modal'

const CURRICULA: Record<string, CurriculumData> = {
  habit: {
    title: 'Khoa Học Giấc Ngủ Sâu 8 Tiếng',
    hours: 1,
    deliverable: 'Sơ đồ Hang Ngủ tối ưu tại nhà + Nhật ký xả tải não (Brain Dump) 7 ngày',
    phases: [
      {
        phase: '15 Phút Đầu',
        title: 'Khoa Học Về Nhịp Sinh Học & Vệ Sinh Giấc Ngủ',
        practiceTime: '15 phút bài học',
        activities: [
          'Cơ chế hormone Melatonin và tác hại của ánh sáng xanh nhân tạo',
          'Nguyên tắc nhiệt độ phòng ngủ lý tưởng (18 - 20°C)',
          'Quy tắc 10-3-2-1-0 trong y học giấc ngủ',
        ],
        milestone: 'Hiểu cặn kẽ vì sao bạn trằn trọc',
      },
      {
        phase: '45 Phút Sau',
        title: 'Thiết Lập Thực Tế Hang Ngủ & Xả Tải Não',
        practiceTime: '45 phút thao tác',
        activities: [
          'Dán băng keo che mọi đèn LED nhỏ trong phòng ngủ',
          'Cài đặt chế độ ban đêm tự động trên điện thoại và laptop',
          'Viết trang Brain Dump đầu tiên để dọn sạch suy nghĩ lo âu trước khi đặt lưng',
        ],
        milestone: 'Hang ngủ hoàn chỉnh & sẵn sàng ngủ sâu',
      },
    ],
  },
  sprint: {
    title: 'Tự Động Hóa Công Việc Với Prompt AI',
    hours: 5,
    deliverable: 'Hệ thống tự động tóm tắt email và trích xuất dữ liệu báo cáo hàng tuần',
    phases: [
      {
        phase: 'Giờ 1',
        title: 'Kỹ Thuật Cấu Trúc Prompt Chuẩn RTC',
        practiceTime: '15m học + 45m thực hành',
        activities: [
          'Nắm vững công thức: Role - Task - Context - Constraints',
          'Tạo kho prompt mẫu cá nhân trên Notion',
        ],
        milestone: 'Loại bỏ hoàn toàn câu trả lời chung chung của AI',
      },
      {
        phase: 'Giờ 2 - 3',
        title: 'Xử Lý Dữ Liệu & Viết Báo Cáo Phân Tích',
        practiceTime: '30m học + 90m thực hành',
        activities: [
          'Nạp file bảng tính / tài liệu dài để AI trích xuất bảng tổng hợp',
          'Thiết lập prompt kiểm tra chéo (Anti-Hallucination prompt)',
        ],
        milestone: 'Rút ngắn 80% thời gian làm báo cáo tuần',
      },
      {
        phase: 'Giờ 4 - 5',
        title: 'Xây Dựng Workflow Tự Động Tóm Tắt Email & Lịch',
        practiceTime: '30m học + 90m thực hành',
        activities: [
          'Kết nối luồng tự động nhận diện email quan trọng',
          'Xuất sản phẩm demo nộp Thư viện để nhận huy hiệu Sub-Skill 5H',
        ],
        milestone: 'Hệ thống tự động vận hành trơn tru',
      },
    ],
  },
  core: {
    title: 'Đệm Hát Guitar 4 Hợp Âm Cơ Bản',
    hours: 20,
    deliverable: 'Video 1 take vừa quạt Ballad vừa hát trọn vẹn 1 bài, không vấp váp',
    phases: [
      {
        phase: 'Buổi 1 - 5',
        title: 'Tư Thế Cầm Đàn & 2 Hợp Âm Đầu Tiên (C & G)',
        practiceTime: '5 giờ tích lũy',
        activities: [
          'Tư thế cổ tay chuẩn để ngón không chạm dây dưới',
          'Bấm êm nốt C và G, không bị rè tiếng',
          'Mẹo giảm đau đầu ngón tay trong tuần đầu tiên',
        ],
        milestone: 'Bấm tròn tiếng không cần nhìn cần đàn',
      },
      {
        phase: 'Buổi 6 - 10',
        title: 'Quy Tắc Ngón Neo & Hợp Âm Am - Fmaj7',
        practiceTime: '5 giờ tích lũy',
        activities: [
          'Ngón tay trỏ làm mỏ neo để xoay chuyển hợp âm trong 0.5 giây',
          'Chinh phục hợp âm chặn biến thể Fmaj7 êm tay',
          'Chuyển vòng 4 hợp âm theo nhịp đếm 40 BPM',
        ],
        milestone: 'Chuyển gam mượt mà đúng nhịp',
      },
      {
        phase: 'Buổi 11 - 15',
        title: 'Tiết Điệu Quạt Chả Ballad & Giữ Phách',
        practiceTime: '5 giờ tích lũy',
        activities: [
          'Kỹ thuật quạt Xuống - Lên lỏng cổ tay',
          'Dậm chân giữ nhịp 4/4 độc lập với tay quạt',
          'Khắc phục lỗi hát nhanh hơn đàn hoặc đàn đuổi theo giọng',
        ],
        milestone: 'Quạt nhịp đều đặn theo máy đánh nhịp Metronome',
      },
      {
        phase: 'Buổi 16 - 20',
        title: 'Ghép Lời Hoàn Chỉnh & Thu Âm Tốt Nghiệp',
        practiceTime: '5 giờ tích lũy',
        activities: [
          'Ghép bài Tuổi Hồng Thơ Ngây / Nhỏ Ơi từng đoạn',
          'Luyện tập 1 take không dừng giữa chừng khi mắc lỗi nhỏ',
          'Quay clip nộp lên Thư viện dự án nhận review bạn học',
        ],
        milestone: 'Video 1 take hoàn chỉnh & nhận chứng nhận MVS',
      },
    ],
  },
}

export function LevelsExplorer() {
  const [activeCurriculum, setActiveCurriculum] = useState<CurriculumData | null>(null)

  return (
    <section id="levels" className="scroll-mt-24 bg-white dark:bg-black text-zinc-900 dark:text-white py-24 px-6 sm:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-zinc-950 dark:text-white">
            3 Cấp Độ Đầu Ra
          </h2>
          <p className="mt-4 text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Mọi khóa học đều bắt buộc đặt tên bằng kết quả có thể đo lường được. Bấm vào từng cấp độ để xem giáo trình chi tiết từng ngày.
          </p>
        </div>

        {/* 3 Cột phân tầng */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Level 1: Micro-Habit (1h) */}
          <div className="bg-[#f4f4f4] text-black p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-4">
                Micro-Habit: 1 Giờ
              </h3>
              <p className="text-base text-zinc-800 leading-relaxed mb-8">
                15 phút lý thuyết nền tảng và 45 phút hướng dẫn thiết lập hệ thống thực tế tại nhà.
              </p>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white text-base font-semibold text-zinc-900">
                  Khoa học giấc ngủ: Cài đặt phòng ngủ và nhật ký xả tải não để ngủ sâu 8 tiếng.
                </div>
                <div className="p-4 bg-white text-base font-semibold text-zinc-900">
                  Tối ưu Notion: Biến Notion thành Second Brain quản lý tài chính và công việc cá nhân.
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setActiveCurriculum(CURRICULA.habit)}
                className="w-full py-4 bg-black text-white hover:bg-zinc-800 text-sm font-black transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none"
              >
                Xem Giáo Trình Chi Tiết →
              </button>
              <div className="mt-3 text-sm font-bold text-zinc-600 text-center">
                Hoàn thành trọn vẹn trong 1 buổi tối
              </div>
            </div>
          </div>

          {/* Level 2: Sub-Skill Sprint (5h) */}
          <div className="bg-[#d1ddd3] text-black p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-4">
                Sub-Skill: 5 Giờ
              </h3>
              <p className="text-base text-zinc-800 leading-relaxed mb-8">
                Làm chủ một công cụ hoặc tác vụ đơn lẻ với 1 giờ bài giảng và 4 giờ thực hành dự án mẫu.
              </p>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white text-base font-semibold text-zinc-900">
                  Prompt AI và tự động hóa: Xây dựng luồng tự động tóm tắt email và nghiên cứu dữ liệu.
                </div>
                <div className="p-4 bg-white text-base font-semibold text-zinc-900">
                  Dựng video ngắn CapCut: Thuộc làu phím tắt, nhịp âm thanh và xuất 3 video TikTok.
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setActiveCurriculum(CURRICULA.sprint)}
                className="w-full py-4 bg-black text-white hover:bg-zinc-800 text-sm font-black transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none"
              >
                Xem Giáo Trình Chi Tiết →
              </button>
              <div className="mt-3 text-sm font-bold text-zinc-700 text-center">
                Dành riêng cho 1 kỳ nghỉ cuối tuần
              </div>
            </div>
          </div>

          {/* Level 3: Comprehensive Core (20h) */}
          <div className="bg-[#fe7141] text-black p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-4">
                Core: 20 Giờ
              </h3>
              <p className="text-base text-black font-medium leading-relaxed mb-8">
                Tiếp thu kỹ năng phức hợp đạt ngưỡng MVS. 20 mô-đun gồm 15 phút bài học và 45 phút tự thực hành.
              </p>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-black text-white text-base font-semibold">
                  Đệm hát Guitar 4 hợp âm: Bấm êm tay C-G-Am-F, quạt Ballad và vừa đàn vừa hát trọn vẹn 1 bài.
                </div>
                <div className="p-4 bg-black text-white text-base font-semibold">
                  Hát chuẩn 1 bài tiếng Trung: Phát âm đúng 4 thanh điệu và hát diễn cảm bài Ánh Trăng Nói Hộ Lòng Tôi.
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setActiveCurriculum(CURRICULA.core)}
                className="w-full py-4 bg-black text-white hover:bg-zinc-900 text-sm font-black transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                Xem Giáo Trình Chi Tiết →
              </button>
              <div className="mt-3 text-sm font-black text-black text-center">
                Cam kết 20 ngày, mỗi ngày 1 giờ
              </div>
            </div>
          </div>
        </div>
      </div>

      <CurriculumModal
        isOpen={!!activeCurriculum}
        onClose={() => setActiveCurriculum(null)}
        data={activeCurriculum}
      />
    </section>
  )
}
