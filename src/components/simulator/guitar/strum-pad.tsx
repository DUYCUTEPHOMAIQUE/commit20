'use client'

import React, { useState, useRef, useCallback } from 'react'
import { guitarAudio } from '@/lib/audio/guitar-audio'
import { CHORD_DICTIONARY } from '@/lib/courses-data'
import { ArrowDown, ArrowUp, Music2 } from 'lucide-react'

interface StrumPadProps {
  currentChord?: string
  className?: string
  onStrum?: (direction: 'down' | 'up') => void
}

export default function StrumPad({
  currentChord = 'Am',
  className = '',
  onStrum,
}: StrumPadProps) {
  const [strumDirection, setStrumDirection] = useState<'down' | 'up' | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const touchStartY = useRef<number | null>(null)
  const lastStrumTime = useRef<number>(0)

  const triggerStrum = useCallback(
    (direction: 'down' | 'up', speedMs = 70) => {
      const now = Date.now()
      // Debounce slightly to prevent accidental double-strums in 35ms
      if (now - lastStrumTime.current < 45) return
      lastStrumTime.current = now

      const chord = CHORD_DICTIONARY[currentChord]
      const frets = chord ? chord.frets : [-1, 0, 2, 2, 1, 0]

      guitarAudio.strumChord(frets, direction, speedMs, 0.85)

      // Optional light haptic buzz on mobile
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        try {
          navigator.vibrate(12)
        } catch {}
      }

      setStrumDirection(direction)
      onStrum?.(direction)

      setTimeout(() => {
        setStrumDirection(null)
      }, 300)
    },
    [currentChord, onStrum]
  )

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartY.current = e.touches[0].clientY
      setIsSwiping(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || e.touches.length === 0) return
    const currentY = e.touches[0].clientY
    const deltaY = currentY - touchStartY.current

    // Trigger strum when user moves finger by at least 25px
    if (deltaY > 25) {
      // Swiped down
      triggerStrum('down', 65)
      touchStartY.current = currentY
    } else if (deltaY < -25) {
      // Swiped up
      triggerStrum('up', 60)
      touchStartY.current = currentY
    }
  }

  const handleTouchEnd = () => {
    touchStartY.current = null
    setIsSwiping(false)
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Visual Strum Zone */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative select-none h-32 sm:h-36 rounded-2xl border-2 transition-all duration-150 flex flex-col items-center justify-center p-3 text-center overflow-hidden cursor-pointer ${
          strumDirection === 'down'
            ? 'bg-gradient-to-b from-[#FE7141]/25 via-[#FE7141]/10 to-transparent border-[#FE7141] scale-[0.98]'
            : strumDirection === 'up'
            ? 'bg-gradient-to-t from-[#FE7141]/25 via-[#FE7141]/10 to-transparent border-[#FE7141] scale-[0.98]'
            : 'bg-neutral-900/90 dark:bg-black/90 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700'
        }`}
        style={{
          boxShadow:
            strumDirection !== null
              ? '0 0 25px rgba(254,113,65,0.35), inset 0 0 15px rgba(254,113,65,0.2)'
              : 'inset 0 2px 4px rgba(0,0,0,0.6)',
        }}
        role="button"
        tabIndex={0}
        aria-label="Vùng vuốt ngón tay quạt đàn"
      >
        {/* Animated Ripple Waves when Strummed */}
        {strumDirection && (
          <div
            className={`absolute inset-0 pointer-events-none ${
              strumDirection === 'down' ? 'animate-in fade-in slide-in-from-top-4' : 'animate-in fade-in slide-in-from-bottom-4'
            } duration-200`}
          >
            <div className="w-full h-1 bg-[#FE7141] opacity-75 blur-[2px]" />
          </div>
        )}

        {/* Center Prompt */}
        <div className="z-10 flex flex-col items-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-[#FE7141]/15 text-[#FE7141] flex items-center justify-center mb-1.5 ring-1 ring-[#FE7141]/30">
            <Music2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-white">
            Vuốt Ngón Cái Để Quạt Đàn
          </span>
          <span className="text-[11px] text-neutral-400 mt-0.5">
            Vuốt ↓ (Down) &bull; Vuốt ↑ (Up)
          </span>
        </div>

        {/* Dynamic Strum Indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-[10px] font-mono font-bold text-neutral-500 pointer-events-none">
          <ArrowDown className={`w-3.5 h-3.5 transition-colors ${strumDirection === 'down' ? 'text-[#FE7141]' : ''}`} />
          <span className="text-[9px] uppercase tracking-wider">{currentChord}</span>
          <ArrowUp className={`w-3.5 h-3.5 transition-colors ${strumDirection === 'up' ? 'text-[#FE7141]' : ''}`} />
        </div>
      </div>

      {/* Quick Tap Buttons for Precision Single-Clicks */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => triggerStrum('down', 65)}
          className="cursor-pointer py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-[#FE7141] active:text-white border border-neutral-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
        >
          <ArrowDown className="w-4 h-4 text-[#FE7141]" />
          <span>Quạt Xuống (↓)</span>
        </button>

        <button
          type="button"
          onClick={() => triggerStrum('up', 60)}
          className="cursor-pointer py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-[#FE7141] active:text-white border border-neutral-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
        >
          <ArrowUp className="w-4 h-4 text-emerald-400" />
          <span>Quạt Lên (↑)</span>
        </button>
      </div>
    </div>
  )
}
