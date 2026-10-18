'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
  defaultSkill?: string
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'signin',
  defaultSkill,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)

    const supabase = createClient()

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
              selected_skill: defaultSkill || null,
            },
          },
        })

        if (error) {
          setErrorMsg(error.message)
        } else if (data.session) {
          setSuccessMsg('Đăng ký và đăng nhập thành công.')
          setTimeout(() => {
            onClose()
            window.location.reload()
          }, 800)
        } else {
          setSuccessMsg('Tài khoản đã tạo. Vui lòng kiểm tra email hoặc đăng nhập.')
          setMode('signin')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setErrorMsg(
            error.message === 'Invalid login credentials'
              ? 'Email hoặc mật khẩu không chính xác.'
              : error.message
          )
        } else {
          setSuccessMsg('Đăng nhập thành công.')
          setTimeout(() => {
            onClose()
            window.location.reload()
          }, 600)
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const origin = window.location.origin
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) {
        setErrorMsg(`Không thể kết nối Google: ${error.message}`)
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white p-8 sm:p-10 shadow-2xl transition-colors max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Đóng cửa sổ đăng nhập"
          className="absolute top-6 right-6 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none p-1"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Brand & Header */}
        <div className="mb-8">
          <Image
            src="/icon.png"
            alt="Commit 20 Logo"
            width={44}
            height={44}
            className="w-11 h-11 rounded-xl object-cover mb-4 shadow-sm"
          />
          <h2
            id="auth-modal-title"
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white"
          >
            {mode === 'signin' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {defaultSkill
              ? `Bắt đầu chinh phục: ${defaultSkill}`
              : 'Cam kết 20 giờ thực hành và đạt ngưỡng MVS.'}
          </p>
        </div>

        {/* PRIMARY 1-CLICK ACTION: GOOGLE SIGN IN */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-white dark:hover:bg-zinc-100 text-black font-black text-base active:scale-[0.99] flex items-center justify-center gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] focus-visible:outline-none disabled:opacity-60"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Tiếp tục với Google</span>
        </button>

        {/* Subtle Divider */}
        <div className="my-6 flex items-center gap-3 text-xs uppercase font-bold text-zinc-400 dark:text-zinc-500">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <span>hoặc dùng email</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 text-sm font-bold mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setErrorMsg(null)
              setSuccessMsg(null)
            }}
            className={`flex-1 py-2.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] ${
              mode === 'signin'
                ? 'bg-[#fe7141] text-black font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setErrorMsg(null)
              setSuccessMsg(null)
            }}
            className={`flex-1 py-2.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fe7141] ${
              mode === 'signup'
                ? 'bg-[#fe7141] text-black font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Notification alerts */}
        {errorMsg && (
          <div role="alert" className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 text-sm font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div role="status" className="mb-4 p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 text-sm font-medium">
            {successMsg}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email-input" className="block text-sm font-bold mb-2 text-zinc-900 dark:text-white">
              Địa chỉ Email
            </label>
            <input
              id="auth-email-input"
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@vidu.com"
              className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-[#fe7141]"
            />
          </div>

          <div>
            <label htmlFor="auth-password-input" className="block text-sm font-bold mb-2 text-zinc-900 dark:text-white">
              Mật khẩu
            </label>
            <input
              id="auth-password-input"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-[#fe7141]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#fe7141] text-black font-black text-base hover:bg-[#ff8559] transition-colors cursor-pointer disabled:opacity-50 mt-2 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
          >
            {loading ? 'Đang xử lý...' : mode === 'signin' ? 'Đăng Nhập Với Email' : 'Tạo Tài Khoản Mới'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  )
}
