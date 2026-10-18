import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/landing/navbar'
import { LearnerJourney } from '@/components/landing/learner-journey'
import { LevelsExplorer } from '@/components/landing/levels-explorer'
import { ProjectGallery } from '@/components/landing/project-gallery'
import { AuthCtaButton } from '@/components/auth/auth-cta-button'
import { ScrollRevealProvider } from '@/components/landing/scroll-reveal'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white flex flex-col overflow-x-clip transition-colors">
      <ScrollRevealProvider />
      <Navbar />

      <main className="flex-1 w-full overflow-x-clip">
        {/* HERO SECTION */}
        <section className="bg-white dark:bg-black pt-16 pb-20 md:pt-24 md:pb-28 px-6 sm:px-8 transition-colors">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-zinc-950 dark:text-white leading-[0.92] uppercase animate-hero-1">
              20 Giờ.
              <br />
              <span className="text-[#fe7141]">Một Kỹ Năng.</span>
            </h1>

            <p className="mt-8 text-xl sm:text-2xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed font-medium animate-hero-2">
              Không cần 10.000 giờ để bắt đầu. Commit 20 đưa bạn chạm tới Ngưỡng Năng Lực Tối Thiểu (MVS) — đủ kiến thức nền tảng để tự sửa lỗi và tự tin tạo ra sản phẩm thực tế đầu tiên.
            </p>

            {/* ACTION-FIRST PRIMARY CTA BUTTONS */}
            <div className="mt-10 animate-hero-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/c/guitar-3-songs"
                className="cursor-pointer inline-flex items-center justify-center px-8 py-5 bg-[#fe7141] text-black hover:bg-[#ff8559] text-xl font-black tracking-tight transition-all active:scale-95 text-center"
              >
                Vào Luyện Đàn Ảo Ngay →
              </Link>
              <AuthCtaButton
                text="Đăng Nhập Lưu Tiến Trình →"
                className="w-full sm:w-auto px-6 py-5 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-base font-bold tracking-tight"
              />
            </div>
            <div className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Chơi ngay không cần tạo tài khoản · Trải nghiệm Web Audio gảy đàn thực tế
            </div>

            <div className="mt-14 flex flex-wrap gap-8 text-base font-bold text-zinc-600 dark:text-zinc-400 animate-hero-4">
              <span className="text-zinc-950 dark:text-white font-black">Tối đa 20 giờ</span>
              <span>15 phút video : 45 phút thực hành</span>
              <span>100% nghiệm thu bằng sản phẩm</span>
            </div>

            {/* REAL PRACTICE FOOTAGE LOOP */}
            <div className="mt-16" data-reveal>
              <div className="bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/assets/guitar-practice-poster.jpg"
                  className="w-full aspect-video max-h-[460px] object-cover"
                  aria-hidden="true"
                >
                  <source src="/assets/guitar-practice.webm" type="video/webm" />
                </video>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 gap-2">
                  <span className="text-zinc-900 dark:text-zinc-200 font-bold">Thực hành có chủ đích: Luyện bấm hợp âm và bending guitar</span>
                  <span>Tư liệu minh họa: Ginda Bestari (CC BY-SA 3.0 via Wikimedia Commons)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: BẢN ĐỒ 3 BƯỚC HÀNH ĐỘNG CỦA NGƯỜI HỌC (HOW IT WORKS) */}
        <div data-reveal>
          <LearnerJourney />
        </div>

        {/* SECTION 3: 3 CẤP ĐỘ ĐẦU RA (VỚI MODAL GIÁO TRÌNH CHI TIẾT) */}
        <div data-reveal>
          <LevelsExplorer />
        </div>

        {/* SECTION 4: THƯ VIỆN SẢN PHẨM HỌC VIÊN (REAL DELIVERABLES PROOF) */}
        <div data-reveal>
          <ProjectGallery />
        </div>

        {/* SECTION 5: FINAL UNIFIED CTA */}
        <section className="bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white py-24 md:py-28 px-6 sm:px-8 text-center transition-colors">
          <div className="max-w-4xl mx-auto" data-reveal>
            <h2 className="text-5xl sm:text-7xl font-black tracking-tight uppercase leading-none text-zinc-950 dark:text-white">
              Bắt Đầu 20 Giờ.
            </h2>
            <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Chọn một mục tiêu cụ thể, bấm giờ luyện tập và tạo ra sản phẩm thực tế đầu tiên của bạn.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3">
              <AuthCtaButton
                text="Tham Gia Commit 20 Ngay →"
                className="w-full sm:w-auto px-12 py-5 bg-[#fe7141] text-black hover:bg-[#ff8559] text-xl font-black tracking-tight"
              />
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                1 tài khoản mở khóa toàn bộ thư viện và lộ trình
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-black py-12 px-6 sm:px-8 text-sm text-zinc-500 dark:text-zinc-400 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="Commit 20"
              width={24}
              height={24}
              className="w-6 h-6 rounded-md object-cover"
            />
            <span className="font-bold text-zinc-950 dark:text-white">Commit 20</span>
            <span>—</span>
            <span>Nền tảng làm chủ kỹ năng siêu tốc</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span>Tư liệu minh họa: CC BY-SA 3.0 via Wikimedia Commons</span>
            <span>&copy; 2026 Commit 20</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
