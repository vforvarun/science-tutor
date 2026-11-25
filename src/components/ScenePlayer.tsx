import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react'
import { narrate, stopSpeaking, unlockAudio } from '../lib/speech'
import narration from '../data/narration.json'
import type { SceneDef } from '../scenes'
import { W, H } from '../scenes/kit'
import { MathText } from './MathText'

const clips = narration.files as Record<string, string[]>
const clipUrl = (scene: string, step: number) => {
  const f = clips[scene]?.[step]
  return f ? `${import.meta.env.BASE_URL}narration/${f}` : undefined
}

/** Plays an animated, narrated explainer — like a video, but live. */
export function ScenePlayer({ scene, onComplete, autoStart = false }: { scene: SceneDef; onComplete?: () => void; autoStart?: boolean }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(autoStart)
  const [muted, setMuted] = useState(false)
  const [big, setBig] = useState(false)
  const [ended, setEnded] = useState(false)
  const token = useRef(0)
  const n = scene.steps.length
  const Comp = scene.Comp

  useEffect(() => () => stopSpeaking(), [])

  useEffect(() => {
    if (!playing) return
    const my = ++token.current
    let cancelled = false
    ;(async () => {
      const text = scene.steps[step]
      if (!muted) {
        // warm up the next clip so there's no gap between steps
        const next = clipUrl(scene.id, step + 1)
        if (next) fetch(next).catch(() => {})
        await narrate(text, clipUrl(scene.id, step))
      }
      else await new Promise((r) => setTimeout(r, Math.max(2500, text.length * 55)))
      await new Promise((r) => setTimeout(r, 700))
      if (cancelled || my !== token.current) return
      if (step + 1 < n) setStep(step + 1)
      else {
        setPlaying(false)
        setEnded(true)
        onComplete?.()
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, step, muted])

  const go = (s: number) => {
    token.current++
    stopSpeaking()
    setStep(Math.max(0, Math.min(n - 1, s)))
    setEnded(false)
  }
  const toggle = () => {
    if (playing) {
      token.current++
      stopSpeaking()
      setPlaying(false)
    } else {
      if (ended) {
        setStep(0)
        setEnded(false)
      }
      unlockAudio()
      setPlaying(true)
    }
  }

  return (
    <div className={big ? 'fixed inset-0 z-50 flex flex-col justify-center bg-ink/95 p-3 sm:p-8' : ''}>
      <div className={`overflow-hidden rounded-[1.6rem] bg-white shadow-[var(--shadow-lift)] ${big ? 'mx-auto w-full max-w-5xl' : ''}`}>
        <div className="relative bg-gradient-to-b from-[#fbfaff] to-[#f3f0ff]">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none" role="img" aria-label={scene.title}>
            <Comp step={step} />
          </svg>
          <AnimatePresence>
            {!playing && (step === 0 || ended) && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={toggle} className="absolute inset-0 grid place-items-center bg-white/40 backdrop-blur-[2px]" aria-label="Play lesson">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-violet text-white shadow-xl pulse">{ended ? <RotateCcw size={34} /> : <Play size={38} fill="white" className="ml-1" />}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div className="border-t border-line px-4 py-3">
          <div className="min-h-[3.4rem] text-[1.02rem] font-medium leading-snug">
            <MathText text={scene.steps[step]} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={toggle} className="grid h-11 w-11 place-items-center rounded-full bg-violet text-white shadow" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={20} fill="white" /> : ended ? <RotateCcw size={20} /> : <Play size={20} fill="white" className="ml-0.5" />}
            </button>
            <button onClick={() => go(step - 1)} className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-black/5" aria-label="Previous step">
              <SkipBack size={18} />
            </button>
            <button onClick={() => go(step + 1)} className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-black/5" aria-label="Next step">
              <SkipForward size={18} />
            </button>
            <div className="mx-1 flex flex-1 gap-1">
              {scene.steps.map((_, i) => (
                <button key={i} onClick={() => go(i)} className={`h-2 flex-1 rounded-full transition ${i < step ? 'bg-violet/50' : i === step ? 'bg-violet' : 'bg-black/10'}`} aria-label={`Step ${i + 1}`} />
              ))}
            </div>
            <span className="hidden text-xs font-semibold tabular-nums text-ink-soft sm:inline">
              {step + 1}/{n}
            </span>
            <button onClick={() => (stopSpeaking(), setMuted(!muted))} className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-black/5" aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button onClick={() => setBig(!big)} className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-black/5" aria-label={big ? 'Exit full screen' : 'Full screen'}>
              {big ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
