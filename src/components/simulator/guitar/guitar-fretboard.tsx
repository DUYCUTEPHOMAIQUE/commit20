'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { guitarAudio, OPEN_STRING_FREQUENCIES, STRING_NAMES } from '@/lib/audio/guitar-audio'
import { CHORD_DICTIONARY, ChordDefinition } from '@/lib/courses-data'
import { Volume2, VolumeX, Sparkles, RefreshCw, Hand, Zap } from 'lucide-react'

interface GuitarFretboardProps {
  initialChord?: string
  allowedChords?: string[]
  onChordChange?: (chord: string) => void
  onPluckString?: (stringIndex: number, fret: number) => void
  className?: string
  isInteractive?: boolean
}

const TOTAL_FRETS = 4 // 4-fret focused view for mobile ergonomics
const STRINGS_COUNT = 6

export default function GuitarFretboard({
  initialChord = 'Am',
  allowedChords = ['Am', 'C', 'G', 'Em', 'Fmaj7', 'Dm'],
  onChordChange,
  onPluckString,
  className = '',
  isInteractive = true,
}: GuitarFretboardProps) {
  const [selectedChordName, setSelectedChordName] = useState<string>(initialChord)
  const [isAutoFret, setIsAutoFret] = useState<boolean>(true)
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false)
  const [activeStrings, setActiveStrings] = useState<number[]>([]) // currently vibrating strings
  const [manualFrets, setManualFrets] = useState<number[]>([0, 0, 0, 0, 0, 0])
  const fretboardRef = useRef<HTMLDivElement>(null)

  const activeChord: ChordDefinition | undefined = CHORD_DICTIONARY[selectedChordName]

  // Unlock audio on first user gesture
  const handleUnlockAudio = useCallback(async () => {
    const success = await guitarAudio.unlock()
    setAudioUnlocked(success)
  }, [])

  // Pluck a specific string
  const handlePluck = useCallback(
    (stringIndex: number, forcedFret?: number) => {
      handleUnlockAudio()
      let fret = 0
      if (forcedFret !== undefined) {
        fret = forcedFret
      } else if (isAutoFret && activeChord) {
        fret = activeChord.frets[stringIndex]
      } else {
        fret = manualFrets[stringIndex]
      }

      if (fret < 0) return // Muted string

      guitarAudio.pluckString(stringIndex, fret, 0.85)

      // Trigger visual vibration animation
      setActiveStrings((prev) => [...prev.filter((idx) => idx !== stringIndex), stringIndex])
      setTimeout(() => {
        setActiveStrings((prev) => prev.filter((idx) => idx !== stringIndex))
      }, 350)

      onPluckString?.(stringIndex, fret)
    },
    [handleUnlockAudio, isAutoFret, activeChord, manualFrets, onPluckString]
  )

  // Switch chord
  const handleSelectChord = (chordName: string) => {
    handleUnlockAudio()
    setSelectedChordName(chordName)
    onChordChange?.(chordName)
    // Auto preview chord strum
    const chord = CHORD_DICTIONARY[chordName]
    if (chord) {
      guitarAudio.strumChord(chord.frets, 'down', 65, 0.75)
    }
  }

  // Handle manual fret touch/click on specific fret and string
  const handleFretClick = (stringIndex: number, fret: number) => {
    handleUnlockAudio()
    if (isAutoFret) {
      // In auto mode, tapping any fret simply plucks that string with the chord note
      handlePluck(stringIndex)
      return
    }
    // In manual mode, toggle fret position
    setManualFrets((prev) => {
      const next = [...prev]
      next[stringIndex] = next[stringIndex] === fret ? 0 : fret
      return next
    })
    handlePluck(stringIndex, fret)
  }

  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* 1. Header Toolbar: Chord Selector & Mode Toggle */}
      <div className="flex flex-col gap-2.5 mb-3">
        {/* Chord Selector Pills (Horizontally scrollable on mobile) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 no-scrollbar touch-pan-x">
            {allowedChords.map((chordName) => {
              const isSelected = selectedChordName === chordName
              return (
                <button
                  key={chordName}
                  type="button"
                  onClick={() => handleSelectChord(chordName)}
                  className={`cursor-pointer px-3.5 py-1.5 rounded-full font-bold text-sm transition-all duration-150 active:scale-95 flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'bg-[#FE7141] text-white shadow-md shadow-[#FE7141]/25 ring-2 ring-[#FE7141]/40 scale-105'
                      : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{chordName}</span>
                </button>
              )
            })}
          </div>

          {/* Mode Switch (Auto vs Manual) & Audio state */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsAutoFret(!isAutoFret)}
              className="cursor-pointer text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex items-center gap-1"
              title={isAutoFret ? 'Đang bật Tự Giữ Hợp Âm' : 'Đang bật Tự Bấm Phím Thủ Công'}
            >
              {isAutoFret ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-[#FE7141]" />
                  <span className="hidden sm:inline">Tự Bấm: </span>Bật
                </>
              ) : (
                <>
                  <Hand className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">Bấm Tay</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Unlock Prompt if muted on mobile Safari */}
        {!audioUnlocked && (
          <button
            type="button"
            onClick={handleUnlockAudio}
            className="cursor-pointer w-full py-1.5 px-3 bg-gradient-to-r from-[#FE7141]/10 via-[#FE7141]/20 to-[#FE7141]/10 border border-[#FE7141]/30 rounded-lg text-xs font-medium text-[#FE7141] flex items-center justify-center gap-1.5 animate-pulse"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Chạm bất kỳ hoặc bấm vào đây để bật tiếng đàn 🎸</span>
          </button>
        )}
      </div>

      {/* 2. The 4-Fret Zoom Fretboard Canvas */}
      <div
        ref={fretboardRef}
        className="relative w-full rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-800 bg-[#141210] shadow-2xl p-2 sm:p-4 text-white"
        style={{
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.06), 0 10px 30px -10px rgba(0,0,0,0.5)',
        }}
      >
        {/* Fret Numbers Header (Top Row) */}
        <div className="grid grid-cols-[28px_repeat(4,1fr)] mb-1 text-[11px] font-mono font-medium text-neutral-500 text-center">
          <div className="text-[10px] text-neutral-600">Nut</div>
          <div>Ngăn 1</div>
          <div>Ngăn 2</div>
          <div className="relative">
            Ngăn 3
            {/* Position Marker Inlay Dot */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-600/60" />
          </div>
          <div>Ngăn 4</div>
        </div>

        {/* Fretboard Body with 6 Strings */}
        <div className="relative flex flex-col justify-between py-1 bg-gradient-to-b from-[#1C1815] via-[#14110E] to-[#1C1815] rounded-xl border border-neutral-800/80">
          {Array.from({ length: STRINGS_COUNT }).map((_, stringIdx) => {
            // String 0 = Low E (thickest), String 5 = High E (thinnest)
            const stringNum = 6 - stringIdx // 6, 5, 4, 3, 2, 1
            const stringName = STRING_NAMES[stringIdx]
            const chordFret = activeChord ? activeChord.frets[stringIdx] : 0
            const fingerNum = activeChord ? activeChord.fingers[stringIdx] : 0
            const isMuted = chordFret === -1
            const isOpen = chordFret === 0
            const isVibrating = activeStrings.includes(stringIdx)

            // Visual gauge (thickness) for strings
            const stringHeight = [3.8, 3.2, 2.6, 2.0, 1.4, 0.9][stringIdx]
            const stringColor = stringIdx < 3 ? '#C5A059' : '#E2E8F0' // bronze wound for 6,5,4; silver steel for 3,2,1

            return (
              <div
                key={stringIdx}
                className="relative grid grid-cols-[28px_repeat(4,1fr)] items-center h-11 sm:h-12 border-b border-neutral-800/40 last:border-b-0"
              >
                {/* Physical String Wire (runs across the entire width) */}
                <div
                  className={`absolute left-7 right-0 pointer-events-none transition-transform duration-75 ${
                    isVibrating ? 'animate-[pulse_0.15s_ease-in-out_infinite]' : ''
                  }`}
                  style={{
                    height: `${stringHeight}px`,
                    backgroundColor: stringColor,
                    boxShadow: isVibrating
                      ? `0 0 8px ${stringColor}, 0 0 14px rgba(254,113,65,0.6)`
                      : '0 1px 2px rgba(0,0,0,0.8)',
                    transform: isVibrating ? 'scaleY(1.8)' : 'scaleY(1)',
                  }}
                />

                {/* Nut Indicator Column (Mute X / Open O / Pluck Trigger) */}
                <div className="flex items-center justify-center z-10">
                  <button
                    type="button"
                    onClick={() => handlePluck(stringIdx, isAutoFret ? chordFret : 0)}
                    disabled={isMuted}
                    className={`cursor-pointer w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs transition-all active:scale-90 ${
                      isMuted
                        ? 'text-red-500/80 cursor-not-allowed bg-red-950/20'
                        : isOpen
                        ? 'text-emerald-400 font-extrabold bg-emerald-950/40 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                        : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
                    }`}
                    title={isMuted ? 'Dây bị câm (X)' : isOpen ? 'Dây buông (O)' : `Dây ${stringNum} (${stringName})`}
                  >
                    {isMuted ? '×' : isOpen ? '○' : stringNum}
                  </button>
                </div>

                {/* Frets 1 to 4 */}
                {Array.from({ length: TOTAL_FRETS }).map((_, fretIdx) => {
                  const fretNumber = fretIdx + 1
                  const isChordFingerHere = isAutoFret && chordFret === fretNumber
                  const isManualFretHere = !isAutoFret && manualFrets[stringIdx] === fretNumber
                  const isActiveFret = isChordFingerHere || isManualFretHere

                  return (
                    <div
                      key={fretNumber}
                      onClick={() => handleFretClick(stringIdx, fretNumber)}
                      className="relative flex items-center justify-center h-full border-r border-neutral-700/60 last:border-r-0 cursor-pointer hover:bg-white/[0.03] transition-colors"
                      role="button"
                      tabIndex={0}
                      aria-label={`Dây ${stringNum} Ngăn ${fretNumber}`}
                    >
                      {/* Metallic Fret Wire on Right Edge */}
                      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neutral-500 via-neutral-300 to-neutral-600 shadow-sm" />

                      {/* Finger Placement Marker Dot */}
                      {isActiveFret && (
                        <div
                          className="z-20 w-8 h-8 rounded-full bg-[#FE7141] text-white font-extrabold text-xs flex items-center justify-center shadow-lg shadow-[#FE7141]/50 ring-2 ring-white/80 animate-in zoom-in-75 duration-150 transform hover:scale-110 active:scale-95"
                          style={{
                            boxShadow: '0 0 14px rgba(254,113,65,0.7), inset 0 1px 2px rgba(255,255,255,0.4)',
                          }}
                        >
                          {fingerNum > 0 ? fingerNum : '●'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Fretboard Footer: String Names & Legend */}
        <div className="flex items-center justify-between mt-2.5 px-1 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FE7141] inline-block" />
              <span>Chấm nốt hợp âm {selectedChordName}</span>
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-500">Chạm dây để gảy</span>
          </div>

          <div className="text-[10px] font-mono text-neutral-500 hidden sm:block">
            Tuning: E A D G B E
          </div>
        </div>
      </div>
    </div>
  )
}
