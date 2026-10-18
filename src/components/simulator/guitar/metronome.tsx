'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Square, Minus, Plus } from 'lucide-react'

interface MetronomeProps {
  initialBpm?: number
  className?: string
}

export default function Metronome({ initialBpm = 80, className = '' }: MetronomeProps) {
  const [bpm, setBpm] = useState<number>(initialBpm)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentBeat, setCurrentBeat] = useState<number>(0) // 0, 1, 2, 3

  const audioCtxRef = useRef<AudioContext | null>(null)
  const timerWorkerRef = useRef<number | null>(null)
  const nextNoteTimeRef = useRef<number>(0)
  const currentBeatRef = useRef<number>(0)
  const isPlayingRef = useRef<boolean>(false)
  const bpmRef = useRef<number>(bpm)

  bpmRef.current = bpm

  const playClick = useCallback((time: number, beat: number) => {
    if (!audioCtxRef.current) return
    const osc = audioCtxRef.current.createOscillator()
    const gain = audioCtxRef.current.createGain()

    // Accented pitch for beat 1 (1000Hz), regular click for 2, 3, 4 (750Hz)
    const isFirstBeat = beat === 0
    osc.frequency.setValueAtTime(isFirstBeat ? 1000 : 750, time)

    gain.gain.setValueAtTime(isFirstBeat ? 0.8 : 0.45, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045)

    osc.connect(gain)
    gain.connect(audioCtxRef.current.destination)

    osc.start(time)
    osc.stop(time + 0.05)
  }, [])

  const scheduler = useCallback(() => {
    if (!audioCtxRef.current) return
    // Schedule notes 100ms ahead
    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + 0.1) {
      playClick(nextNoteTimeRef.current, currentBeatRef.current)

      // Update UI beat indicator
      const beatToDisplay = currentBeatRef.current
      setTimeout(() => {
        if (isPlayingRef.current) {
          setCurrentBeat(beatToDisplay)
        }
      }, Math.max(0, (nextNoteTimeRef.current - audioCtxRef.current.currentTime) * 1000))

      // Advance beat
      const secondsPerBeat = 60.0 / bpmRef.current
      nextNoteTimeRef.current += secondsPerBeat
      currentBeatRef.current = (currentBeatRef.current + 1) % 4
    }
  }, [playClick])

  const togglePlay = () => {
    if (isPlaying) {
      isPlayingRef.current = false
      setIsPlaying(false)
      if (timerWorkerRef.current !== null) {
        window.clearInterval(timerWorkerRef.current)
        timerWorkerRef.current = null
      }
      setCurrentBeat(0)
    } else {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtxRef.current = new AudioCtxClass()
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }

      isPlayingRef.current = true
      setIsPlaying(true)
      currentBeatRef.current = 0
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05

      timerWorkerRef.current = window.setInterval(scheduler, 25)
    }
  }

  useEffect(() => {
    return () => {
      if (timerWorkerRef.current !== null) {
        window.clearInterval(timerWorkerRef.current)
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  return (
    <div className={`flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white ${className}`}>
      {/* 1. Play/Stop Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`cursor-pointer w-9 h-9 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
          isPlaying
            ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/20'
            : 'bg-[#FE7141] text-white shadow-md shadow-[#FE7141]/25 hover:bg-[#FE7141]/90'
        }`}
        title={isPlaying ? 'Dừng máy đếm nhịp' : 'Bật máy đếm nhịp'}
        aria-label={isPlaying ? 'Dừng máy đếm nhịp' : 'Bật máy đếm nhịp'}
      >
        {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* 2. BPM Display & Adjustment */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setBpm((prev) => Math.max(40, prev - 5))}
          className="cursor-pointer w-7 h-7 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors active:scale-90"
          title="Giảm 5 BPM"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="flex flex-col items-center min-w-[58px]">
          <span className="font-mono font-bold text-sm text-neutral-100">{bpm}</span>
          <span className="text-[9px] uppercase tracking-wider text-neutral-500">BPM (4/4)</span>
        </div>

        <button
          type="button"
          onClick={() => setBpm((prev) => Math.min(180, prev + 5))}
          className="cursor-pointer w-7 h-7 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors active:scale-90"
          title="Tăng 5 BPM"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Visual 4-Beat LED Dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2, 3].map((beatIndex) => {
          const isActive = isPlaying && currentBeat === beatIndex
          const isFirstBeat = beatIndex === 0
          return (
            <div
              key={beatIndex}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-75 ${
                isActive
                  ? isFirstBeat
                    ? 'bg-[#FE7141] scale-125 shadow-[0_0_8px_#FE7141]'
                    : 'bg-emerald-400 scale-125 shadow-[0_0_8px_#34D399]'
                  : 'bg-neutral-800 border border-neutral-700/60'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
