'use client'

import { useState } from 'react'
import { AuthModal } from './auth-modal'

interface AuthCtaButtonProps {
  text?: string
  className?: string
  initialMode?: 'signin' | 'signup'
}

export function AuthCtaButton({
  text = 'Đăng nhập hoặc Đăng ký',
  className = '',
  initialMode = 'signin',
}: AuthCtaButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center justify-center px-8 py-4 bg-[#fe7141] text-black hover:bg-[#ff8559] active:scale-[0.99] font-black text-lg transition-all cursor-pointer ${className}`}
      >
        <span>{text}</span>
      </button>

      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialMode={initialMode}
      />
    </>
  )
}
