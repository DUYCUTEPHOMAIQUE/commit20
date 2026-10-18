'use client'

interface Step {
  step: string
  title: string
  lead: string
  detail: string
}

const STEPS: Step[] = [
  {
    step: 'Bước 1',
    title: 'Chọn 1 Đầu Ra Cụ Thể',
    lead: 'Không học lan man. Bạn chọn 1 kỹ năng với cam kết sản phẩm đo lường được.',
    detail: 'Thay vì "học guitar cơ bản", bạn chọn "Đệm hát bài Tuổi Hồng Thơ Ngây trong 20 giờ". Mục tiêu sắc nét giúp bạn tập trung 100% nỗ lực.',
  },
  {
    step: 'Bước 2',
    title: 'Chu Kỳ 15/45 Hàng Ngày',
    lead: '15 phút bài học vi mô và 45 phút bấm giờ luyện tập có chủ đích.',
    detail: 'Hệ thống đo đếm số phút bạn bấm giờ thực hành thực tế. Không tính thời gian xem video thụ động, loại bỏ hoàn toàn ảo giác tưởng mình đã hiểu.',
  },
  {
    step: 'Bước 3',
    title: 'Nghiệm Thu Bằng Sản Phẩm',
    lead: 'Tải sản phẩm thực tế lên Thư viện để cộng đồng đánh giá và công nhận.',
    detail: 'Video 1 take bấm đàn, bản ghi âm bài hát tiếng Trung hoặc ảnh 5 mâm cơm. Nhận phản hồi đồng đẳng từ bạn học và tự hào chia sẻ thành quả.',
  },
]

export function LearnerJourney() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-zinc-100 dark:bg-zinc-950 py-20 md:py-24 px-6 sm:px-8 text-zinc-900 dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-14">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Cách Commit 20 Hoạt Động
          </h2>
          <p className="mt-4 text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
            3 bước đưa bạn từ con số 0 tới ngưỡng tự tin tự sửa sai và tạo ra sản phẩm cầm tay thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="bg-white dark:bg-black p-8 sm:p-10 flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-black text-[#fe7141] uppercase tracking-wide mb-4">
                  {s.step}
                </div>

                <h3 className="text-2xl font-black text-zinc-950 dark:text-white mb-4">
                  {s.title}
                </h3>
                <p className="text-base text-zinc-800 dark:text-zinc-300 font-medium leading-relaxed mb-4">
                  {s.lead}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {s.detail}
                </p>
              </div>

              <div className="mt-8 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Chu trình khép kín hướng mục tiêu
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
