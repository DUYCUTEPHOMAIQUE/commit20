'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryItem {
  id: string
  category: 'all' | 'music' | 'language' | 'lifestyle' | 'cooking'
  title: string
  deliverable: string
  author: string
  authorRole: string
  avatar: string
  coverImage: string
  practiceHours: number
  kudos: number
  reviewsCount: number
  quote: string
}

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'music', label: 'Âm nhạc' },
  { id: 'language', label: 'Ngoại ngữ' },
  { id: 'lifestyle', label: 'Phong cách sống' },
  { id: 'cooking', label: 'Ẩm thực' },
] as const

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    category: 'language',
    title: 'Hát chuẩn và thuộc làu bài Ánh Trăng Nói Hộ Lòng Tôi',
    deliverable: 'Video hát mộc trên nền beat karaoke, đúng 4 thanh điệu tiếng Trung',
    author: 'Lan Anh',
    authorRole: 'Nhân viên Marketing',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop',
    practiceHours: 20,
    kudos: 342,
    reviewsCount: 28,
    quote: 'Trước đây mình nghĩ phải học 1 năm mới hát được. Nhờ lộ trình bẻ nhỏ 20 giờ, ngày 10 mình đã thuộc điệp khúc.',
  },
  {
    id: '2',
    category: 'music',
    title: 'Đệm hát trọn vẹn bài Guitar Tuổi Hồng Thơ Ngây',
    deliverable: 'Video 1 take bấm êm 4 hợp âm cơ bản, vừa quạt Ballad vừa hát',
    author: 'Đức Việt',
    authorRole: 'Kỹ sư phần mềm',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800&auto=format&fit=crop',
    practiceHours: 20,
    kudos: 519,
    reviewsCount: 45,
    quote: 'Ngón tay đau mấy ngày đầu nhưng nhờ quy tắc ngón neo nên chuyển gam rất mượt.',
  },
  {
    id: '3',
    category: 'lifestyle',
    title: 'Cài đặt nhịp sinh học và ngủ sâu 8 tiếng không trằn trọc',
    deliverable: 'Bản thiết lập Hang Ngủ + Nhật ký xả tải não 7 ngày liên tiếp',
    author: 'Hoàng Nam',
    authorRole: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop',
    practiceHours: 1,
    kudos: 418,
    reviewsCount: 31,
    quote: 'Chỉ 1 giờ học và setup đúng: dán đèn LED, cắt cà phê sau 14h và viết Brain Dump. 15 phút là ngủ ngay.',
  },
  {
    id: '4',
    category: 'cooking',
    title: 'Nấu thành thạo 5 mâm cơm gia đình truyền thống',
    deliverable: 'Album ảnh 5 mâm cơm hoàn chỉnh kèm nhận xét của người thân',
    author: 'Thảo My',
    authorRole: 'Sinh viên',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    practiceHours: 20,
    kudos: 275,
    reviewsCount: 22,
    quote: 'Bí quyết tỷ lệ vàng 3 mắm : 2 đường : 1 tiêu giúp món kho ngon chuẩn vị.',
  },
]

export function ProjectGallery() {
  const [selectedCat, setSelectedCat] = useState<string>('all')

  const filteredItems =
    selectedCat === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCat)

  return (
    <section id="showcase" className="scroll-mt-24 py-20 md:py-24 bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-zinc-950 dark:text-white">
              Sản Phẩm Đầu Ra Thực Tế
            </h2>
            <p className="mt-4 text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Không cấp chứng chỉ giấy vô nghĩa. Học viên tốt nghiệp bằng chính sản phẩm thực tế cầm tay được bạn học nghiệm thu.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-2 text-sm font-bold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none ${
                  selectedCat === cat.id
                    ? 'bg-[#fe7141] text-black font-black'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-zinc-100 dark:bg-zinc-900 flex flex-col justify-between">
              <div className="relative aspect-[4/3] w-full bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute top-4 left-4 bg-black text-[#fe7141] font-black text-sm px-3 py-1">
                  {item.practiceHours} Giờ Thực Hành
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-950 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    &quot;{item.quote}&quot;
                  </p>
                </div>

                <div className="mt-6 bg-white dark:bg-zinc-950 p-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.avatar}
                      alt={item.author}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                      style={{ width: 36, height: 36 }}
                    />
                    <div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-white">{item.author}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{item.authorRole}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm font-bold text-zinc-600 dark:text-zinc-400">
                    <span className="text-[#fe7141]">
                      {item.kudos} ủng hộ
                    </span>
                    <span>{item.reviewsCount} nhận xét</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
