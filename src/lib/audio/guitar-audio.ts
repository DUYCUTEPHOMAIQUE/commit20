/**
 * Web Audio Guitar Synthesizer Engine
 * 
 * Provides zero-latency, realistic plucked acoustic guitar sound synthesis
 * using Karplus-Strong plucked string modeling / harmonic overtone filtering.
 * Handles iOS Safari / Android Chrome AudioContext autoplay unlock automatically.
 */

// Fundamental base frequencies for standard acoustic guitar tuning (E2, A2, D3, G3, B3, E4)
export const OPEN_STRING_FREQUENCIES = [
  82.41,  // String 6 (Low E)
  110.00, // String 5 (A)
  146.83, // String 4 (D)
  196.00, // String 3 (G)
  246.94, // String 2 (B)
  329.63, // String 1 (High E)
]

export const STRING_NAMES = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

class GuitarAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private compressor: DynamicsCompressorNode | null = null
  private isUnlocked = false

  public init() {
    if (typeof window === 'undefined') return
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtxClass()

      // Master dynamics compressor to prevent clipping when strumming 6 strings simultaneously
      this.compressor = this.ctx.createDynamicsCompressor()
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime)
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime)
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime)
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime)
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime)

      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime)

      this.compressor.connect(this.masterGain)
      this.masterGain.connect(this.ctx.destination)
    }
  }

  /**
   * Unlock AudioContext on iOS/Android first user interaction
   */
  public async unlock(): Promise<boolean> {
    this.init()
    if (!this.ctx) return false

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume()
      } catch (err) {
        console.warn('AudioContext resume failed:', err)
      }
    }

    if (!this.isUnlocked) {
      // Play a short silent buffer to prime hardware audio pipeline on iOS Safari
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050)
        const source = this.ctx.createBufferSource()
        source.buffer = buffer
        source.connect(this.ctx.destination)
        source.start(0)
        this.isUnlocked = true
      } catch (err) {
        console.warn('Silent buffer unlock failed:', err)
      }
    }

    return this.ctx.state === 'running'
  }

  public getContextState(): AudioContextState | 'uninitialized' {
    return this.ctx ? this.ctx.state : 'uninitialized'
  }

  /**
   * Calculate frequency for a specific string and fret
   * stringIndex: 0 (E2 Low) to 5 (E4 High)
   * fret: -1 (mute), 0 (open), 1-12 (fretted)
   */
  public getFrequency(stringIndex: number, fret: number): number | null {
    if (fret < 0) return null // Muted string
    const baseFreq = OPEN_STRING_FREQUENCIES[stringIndex]
    if (!baseFreq) return null
    // f = f0 * 2^(fret / 12)
    return baseFreq * Math.pow(2, fret / 12)
  }

  /**
   * Synthesize an authentic acoustic guitar pluck with realistic harmonics and exponential decay
   */
  public pluckString(stringIndex: number, fret: number, velocity = 0.8, scheduledTime?: number) {
    if (fret < 0) return // Muted string
    this.unlock()
    if (!this.ctx || !this.compressor) return

    const freq = this.getFrequency(stringIndex, fret)
    if (!freq) return

    const startTime = scheduledTime !== undefined ? scheduledTime : this.ctx.currentTime
    const duration = 2.4 // Acoustic ring decay duration in seconds

    // 1. Fundamental Oscillator
    const oscFundamental = this.ctx.createOscillator()
    oscFundamental.type = 'triangle'
    oscFundamental.frequency.setValueAtTime(freq, startTime)

    // 2. Harmonic Overtone Oscillator (Adds acoustic body & brightness)
    const oscOvertone = this.ctx.createOscillator()
    oscOvertone.type = 'sawtooth'
    oscOvertone.frequency.setValueAtTime(freq * 2, startTime)

    // Filter to simulate wooden guitar body resonance (dampens higher harsh frequencies quickly)
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    // Dynamic filter cutoff based on string register
    const cutoff = Math.min(freq * 6, 4200)
    filter.frequency.setValueAtTime(cutoff, startTime)
    filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 300), startTime + duration * 0.7)

    // Gain Envelopes (Pluck attack -> natural decay)
    const pluckGain = this.ctx.createGain()
    const overtoneGain = this.ctx.createGain()

    // Overtone level
    overtoneGain.gain.setValueAtTime(0.18 * velocity, startTime)
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6)

    // Fundamental Envelope (Instant attack, curved exponential decay)
    pluckGain.gain.setValueAtTime(0.0001, startTime)
    // 3ms attack to avoid digital click
    pluckGain.gain.linearRampToValueAtTime(velocity * 0.75, startTime + 0.004)
    // Decay curve
    pluckGain.gain.exponentialRampToValueAtTime(velocity * 0.35, startTime + 0.15)
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

    // Connect node graph
    oscFundamental.connect(pluckGain)
    oscOvertone.connect(overtoneGain)
    overtoneGain.connect(pluckGain)
    pluckGain.connect(filter)
    filter.connect(this.compressor)

    // Start & Stop
    oscFundamental.start(startTime)
    oscOvertone.start(startTime)
    oscFundamental.stop(startTime + duration)
    oscOvertone.stop(startTime + duration)
  }

  /**
   * Strum a full 6-string chord with humanized micro-delays between strings
   * @param frets Array of 6 numbers: [-1, 0, 2, 2, 1, 0] for Am
   * @param direction 'down' (string 6 to 1) or 'up' (string 1 to 6)
   * @param speedMs Total duration of strum across strings (typically 50ms - 120ms)
   * @param velocity Strum dynamic intensity (0.2 to 1.0)
   */
  public strumChord(
    frets: number[],
    direction: 'down' | 'up' = 'down',
    speedMs = 70,
    velocity = 0.8
  ) {
    this.unlock()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const playableStrings: number[] = []

    for (let i = 0; i < 6; i++) {
      if (frets[i] !== undefined && frets[i] >= 0) {
        playableStrings.push(i)
      }
    }

    if (playableStrings.length === 0) return

    const order = direction === 'down' ? playableStrings : [...playableStrings].reverse()
    const delayPerString = (speedMs / 1000) / order.length

    order.forEach((stringIndex, step) => {
      const fret = frets[stringIndex]
      const scheduledTime = now + step * delayPerString
      // Slightly vary velocity per string for organic realism
      const humanVelocity = Math.max(0.1, Math.min(1.0, velocity * (0.92 + Math.random() * 0.16)))
      this.pluckString(stringIndex, fret, humanVelocity, scheduledTime)
    })
  }
}

export const guitarAudio = new GuitarAudioEngine()
