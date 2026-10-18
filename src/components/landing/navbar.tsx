import Link from 'next/link'
import Image from 'next/image'
import { UserMenu } from '@/components/auth/user-menu'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-black/95 backdrop-blur-sm text-zinc-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 sm:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none group"
        >
          <Image
            src="/icon.png"
            alt="Commit 20 Logo"
            width={40}
            height={40}
            className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
            priority
          />
          <span className="text-xl font-black tracking-tight uppercase">
            Commit 20
          </span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-600 dark:text-zinc-400">
          <a href="#how-it-works" className="hover:text-black dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#fe7141]">
            Cách Hoạt Động
          </a>
          <a href="#levels" className="hover:text-black dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#fe7141]">
            3 Cấp Độ Đầu Ra
          </a>
          <a href="#showcase" className="hover:text-black dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#fe7141]">
            Sản Phẩm Thực Tế
          </a>
        </nav>

        {/* Unified Auth Action & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
