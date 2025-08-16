/**
 * AgentSystems UI Audio
 * Lightweight, file-free UI SFX via Web Audio API
 */

type MaybeCtx = AudioContext | null

let audioContext: MaybeCtx = null
let masterGain: GainNode | null = null
let limiter: DynamicsCompressorNode | null = null
let lastPlay = 0 // rate limit

const PREFERENCE_KEY = "audio-enabled"
const VOLUME_KEY = "audio-volume"

/** Lazy init + master bus with a gentle limiter */
const getAudioContext = (): MaybeCtx => {
  if (audioContext) return audioContext
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
    audioContext = new Ctx()
    
    limiter = audioContext.createDynamicsCompressor()
    // Subtle limiting—prevents harsh peaks on some devices
    limiter.threshold.value = -12
    limiter.knee.value = 10
    limiter.ratio.value = 12
    limiter.attack.value = 0.002
    limiter.release.value = 0.06

    masterGain = audioContext.createGain()
    masterGain.gain.value = getVolume()

    // master chain: limiter -> masterGain -> destination
    limiter.connect(masterGain)
    masterGain.connect(audioContext.destination)
  } catch (e) {
    console.warn("Web Audio API not supported:", e)
    return null
  }
  return audioContext
}

const resumeIfSuspended = async (ctx: AudioContext) => {
  if (ctx.state === "suspended") {
    try { await ctx.resume() } catch {}
  }
}

const canPlay = (now: number, minGapMs = 18) => now - lastPlay > minGapMs

/** ---------- Helpers specific to the 171697-style click ---------- **/

/** Soft clipper adds gentle “plastic” bite without harshness */
const makeSoftClip = (ctx: AudioContext): WaveShaperNode => {
  const ws = ctx.createWaveShaper()
  const curve = new Float32Array(1024)
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1 // [-1, 1]
    curve[i] = Math.tanh(3 * x)
  }
  ws.curve = curve
  ws.oversample = "2x"
  return ws
}

/** Short white-noise buffer reused per play */
let noiseBuf: AudioBuffer | null = null
const getNoiseBuffer = (ctx: AudioContext): AudioBuffer => {
  if (noiseBuf) return noiseBuf
  const len = Math.floor(ctx.sampleRate * 0.018) // ~18ms
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = noiseBuf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return noiseBuf
}

/**
 * Cyber click: approximation of Freesound #171697 (NenadSimic “Menu Selection Click”)
 * Triangle pluck + tiny noise pop → bandpass (~2.1kHz), highpass, soft clip → limiter
 */
export const playCyberClick = async () => {
  if (!isEnabled()) return
  const ctx = getAudioContext()
  if (!ctx || !limiter) return

  await resumeIfSuspended(ctx)

  const t0 = ctx.currentTime
  const now = performance.now()
  if (!canPlay(now)) return
  lastPlay = now

  // Tiny randomization so repeats feel natural
  const detuneCents = 8 * (Math.random() * 2 - 1) // ±8 cents
  const fStart = 1850 // starting freq - even higher for that "clink"
  const fEnd = 520   // end freq after quick glide

  // Tone body: triangle “pluck” with fast downward pitch ramp
  const osc = ctx.createOscillator()
  osc.type = "triangle"
  osc.frequency.setValueAtTime(fStart, t0)
  osc.detune.setValueAtTime(detuneCents, t0)
  osc.frequency.exponentialRampToValueAtTime(fEnd, t0 + 0.028) // ~28ms glide

  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0, t0)
  oscGain.gain.linearRampToValueAtTime(0.12, t0 + 0.0008)        // ~0.8ms ultra-sharp attack
  oscGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.045)  // ~45ms decay

  // Tiny noise pop for mechanical onset
  const noise = ctx.createBufferSource()
  noise.buffer = getNoiseBuffer(ctx)
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.045, t0)                       // noise level
  noiseGain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.018)

  // Resonant band-pass shapes the "plastic UI" timbre
  const bp = ctx.createBiquadFilter()
  bp.type = "bandpass"
  bp.Q.setValueAtTime(12, t0)            // even more narrow for sharper tone
  bp.frequency.setValueAtTime(2700, t0)  // center ~2.7 kHz - very bright

  // Gentle high-pass to keep lows clean
  const hp = ctx.createBiquadFilter()
  hp.type = "highpass"
  hp.frequency.setValueAtTime(220, t0)

  // Soft clip for a little bite
  const clip = makeSoftClip(ctx)

  // Output trim (final per-sound gain before limiter)
  const out = ctx.createGain()
  out.gain.value = 0.85

  // Routing
  osc.connect(oscGain)
  noise.connect(noiseGain)

  const mix = ctx.createGain()
  oscGain.connect(mix)
  noiseGain.connect(mix)

  mix.connect(bp)
  bp.connect(hp)
  hp.connect(clip)
  clip.connect(out)
  out.connect(limiter)

  // Schedule
  osc.start(t0)
  osc.stop(t0 + 0.06) // ~60ms total
  noise.start(t0)
  noise.stop(t0 + 0.02) // ~20ms noise
}

/**
 * Generate a subtle UI interaction sound for non-cyber themes
 * Softer, more professional tone
 */
export const playUIClick = (): void => {
  const ctx = getAudioContext()
  if (!ctx || !limiter) return

  if (ctx.state === 'suspended') {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ctx.resume()
  }

  const t0 = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const lp = ctx.createBiquadFilter()

  osc.connect(g)
  g.connect(lp)
  lp.connect(limiter)

  // Subtle, modern pluck
  osc.type = 'sine'
  const f0 = 620 + Math.random() * 40
  osc.frequency.setValueAtTime(f0, t0)
  osc.frequency.exponentialRampToValueAtTime(420, t0 + 0.05)

  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(0.07, t0 + 0.008)
  g.gain.exponentialRampToValueAtTime(0.005, t0 + 0.11)

  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(2500, t0)
  lp.Q.value = 0.7

  osc.start(t0)
  osc.stop(t0 + 0.12)
}

const isEnabled = (): boolean => localStorage.getItem(PREFERENCE_KEY) !== "false"

export const setAudioEnabled = (enabled: boolean) => localStorage.setItem(PREFERENCE_KEY, String(enabled))
export const isAudioEnabled = () => isEnabled()

export const setVolume = (v: number) => {
  const vol = Math.min(1, Math.max(0, v))
  localStorage.setItem(VOLUME_KEY, String(vol))
  if (masterGain && audioContext) masterGain.gain.setTargetAtTime(vol, audioContext.currentTime, 0.01)
}

export const getVolume = () => {
  const raw = localStorage.getItem(VOLUME_KEY)
  const v = raw == null ? 0.5 : Number(raw)
  return isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.5
}

/** Call once on first user gesture to "unlock" audio on iOS/Safari */
export const unlockAudio = async () => {
  const ctx = getAudioContext()
  if (!ctx) return
  await resumeIfSuspended(ctx)
}