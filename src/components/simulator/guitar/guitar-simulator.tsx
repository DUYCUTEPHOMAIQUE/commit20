'use client'

import React, { useState } from 'react'
import GuitarFretboard from './guitar-fretboard'
import StrumPad from './strum-pad'
import Metronome from './metronome'

interface GuitarSimulatorProps {
  initialChord?: string
  allowedChords?: string[]
  defaultBpm?: number
  onChordChange?: (chord: string) => void
  className?: string
}

export default function GuitarSimulator({
  initialChord = 'Am',
  allowedChords = ['Am', 'C', 'G', 'Em', 'Fmaj7', 'Dm'],
  defaultBpm = 80,
  onChordChange,
  className = '',
}: GuitarSimulatorProps) {
  const [currentChord, setCurrentChord] = useState<string>(initialChord)

  const handleChordSelect = (chord: string) => {
    setCurrentChord(chord)
    onChordChange?.(chord)
  }

  return (
    <div className={`flex flex-col gap-3.5 w-full max-w-xl mx-auto ${className}`}>
      {/* 1. Interactive 4-Fret Zoom Fretboard */}
      <GuitarFretboard
        initialChord={currentChord}
        allowedChords={allowedChords}
        onChordChange={handleChordSelect}
      />

      {/* 2. Lower Controls: Thumb Strumming Pad + Metronome */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
        {/* Metronome */}
        <div className="flex flex-col justify-between">
          <Metronome initialBpm={defaultBpm} />
          <div className="hidden sm:flex flex-col gap-1 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/60 mt-3 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">💡 Mẹo luyện tập 15/45:</span>
            <span>15 phút đầu làm quen thế bấm ngón, 45 phút sau tập quạt đều phách với Metronome.</span>
          </div>
        </div>

        {/* Thumb Strumming Zone */}
        <StrumPad currentChord={currentChord} />
      </div>
    </div>
  )
}
