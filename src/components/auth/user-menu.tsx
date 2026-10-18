'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthModal } from './auth-modal'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const fetchUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)
      setLoading(false)
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  if (loading) {
    return <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
  }

  if (!user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowAuthModal(true)}
          className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold text-sm tracking-tight transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none"
        >
          Đăng nhập
        </button>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    )
  }

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Học viên'

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5 px-3 py-1.5 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
        ) : (
          <Image
            src="/icon.png"
            alt={displayName}
            width={28}
            height={28}
            className="rounded-full object-cover w-7 h-7"
          />
        )}
        <div className="text-left">
          <div className="text-sm font-bold max-w-[140px] truncate leading-tight">
            {displayName}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[140px] truncate leading-tight">
            {user.email}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        className="px-3 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white text-xs font-bold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none"
      >
        Đăng xuất
      </button>
    </div>
  )
}
