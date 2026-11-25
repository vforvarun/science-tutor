// English narration for animated lessons, using the device's built-in voices.

export const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
let cache: SpeechSynthesisVoice[] = []

function load() {
  if (!ttsSupported) return []
  const v = window.speechSynthesis.getVoices().filter((x) => x.lang.toLowerCase().startsWith('en'))
  if (v.length) cache = v
  return cache
}
if (ttsSupported) {
  load()
  window.speechSynthesis.addEventListener?.('voiceschanged', load)
}

const GOOD = ['natural', 'online', 'premium', 'enhanced', 'google', 'karen', 'catherine', 'natasha', 'william', 'lee', 'samantha', 'daniel', 'serena', 'aria', 'jenny']
function rank(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase()
  let r = 0
  GOOD.forEach((g, i) => n.includes(g) && (r += 100 - i))
  if (v.lang === 'en-AU') r += 60
  else if (v.lang === 'en-GB') r += 25
  else if (v.lang === 'en-US') r += 15
  return r
}
export function englishVoices() {
  return [...load()].sort((a, b) => rank(b) - rank(a))
}

let preferred: string | undefined
let rate = 1
let recorded = true
export function configureVoice(uri: string | undefined, r: number, useRecorded = recorded) {
  preferred = uri
  rate = r
  recorded = useRecorded
}

// ---------- Pre-recorded narration (natural neural voice) ----------
let audioEl: HTMLAudioElement | null = null
let stopClip: (() => void) | null = null
const audio = () => (audioEl ??= new Audio())

let silent: string | null = null
function silentWav() {
  if (silent) return silent
  const n = 800
  const b = new ArrayBuffer(44 + n * 2)
  const v = new DataView(b)
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 8000, true)
  v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true)
  return (silent = URL.createObjectURL(new Blob([b], { type: 'audio/wav' })))
}

/** Call from a tap/click: iPad Safari only lets audio play after a user gesture. */
export function unlockAudio() {
  if (!recorded || typeof Audio === 'undefined') return
  const a = audio()
  if (!a.paused && a.src) return
  a.src = silentWav()
  a.play().catch(() => {})
}

/** Plays a recorded clip. Resolves true when it finished (or was stopped), false if it couldn't play. */
function playClip(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const a = audio()
    let timer = 0
    const done = (ok: boolean) => {
      if (stopClip !== stop) return
      stopClip = null
      clearTimeout(timer)
      a.onended = a.onerror = a.onloadedmetadata = null
      resolve(ok)
    }
    const stop = () => done(true)
    stopClip?.()
    stopClip = stop
    a.onended = () => done(true)
    a.onerror = () => done(false)
    // safety net if 'ended' never fires
    a.onloadedmetadata = () => {
      clearTimeout(timer)
      timer = window.setTimeout(() => done(true), (a.duration / a.playbackRate) * 1000 + 3000)
    }
    a.src = url
    a.playbackRate = Math.max(0.6, Math.min(1.4, rate))
    timer = window.setTimeout(() => done(false), 15000) // never started (offline / blocked)
    a.play().catch(() => done(false))
  })
}

/** Narrate a lesson line: the recorded clip if there is one, otherwise the device voice. */
export async function narrate(text: string, clip?: string): Promise<void> {
  if (clip && recorded && typeof Audio !== 'undefined') {
    if (await playClip(clip)) return
  }
  return speak(text)
}

/** Turn maths notation into something a voice can read. */
export function spoken(text: string): string {
  return text
    .replaceAll('\\$', '\u0001')
    .replace(/\$\$?([^$]+)\$\$?/g, '$1')
    .replaceAll('\u0001', '$')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1 over $2')
    .replace(/\\times/g, ' times ')
    .replace(/\\div/g, ' divided by ')
    .replace(/\\sqrt\{([^}]*)\}/g, 'root $1')
    .replace(/\^2/g, ' squared')
    .replace(/\^3/g, ' cubed')
    .replace(/\^\{?(\d+)\}?/g, ' to the power $1')
    .replace(/\\(le|leq)/g, ' less than or equal to ')
    .replace(/\\(ge|geq)/g, ' greater than or equal to ')
    .replace(/\\theta/g, 'theta')
    .replace(/\\sin/g, ' sine ')
    .replace(/\\cos/g, ' cos ')
    .replace(/\\tan/g, ' tan ')
    .replace(/\\pi/g, 'pi')
    .replace(/\\[a-z]+/g, ' ')
    .replace(/[{}*]/g, '')
    .replace(/−/g, 'minus ')
    .replace(/\s+/g, ' ')
}

export function speak(text: string, opts: { rate?: number } = {}): Promise<void> {
  return new Promise((resolve) => {
    if (!ttsSupported) return resolve()
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(spoken(text))
    const voices = englishVoices()
    const v = voices.find((x) => x.voiceURI === preferred) ?? voices[0]
    if (v) u.voice = v
    u.lang = v?.lang ?? 'en-AU'
    u.rate = Math.max(0.6, Math.min(1.4, rate * (opts.rate ?? 1)))
    let done = false
    const finish = () => {
      if (!done) {
        done = true
        resolve()
      }
    }
    u.onend = finish
    u.onerror = finish
    // safety net: some browsers never fire onend
    setTimeout(finish, Math.max(4000, text.length * 90))
    synth.speak(u)
  })
}

export function stopSpeaking() {
  if (ttsSupported) window.speechSynthesis.cancel()
  if (audioEl) audioEl.pause()
  stopClip?.()
}
