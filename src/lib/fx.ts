import confetti from 'canvas-confetti'
import { useStore } from './store'

let ctx: AudioContext | null = null

function tone(freqs: number[], dur = 0.12, type: OscillatorType = 'sine', gap = 0.09) {
  if (!useStore.getState().profile.sound) return
  try {
    ctx ??= new AudioContext()
    const t0 = ctx.currentTime
    freqs.forEach((f, i) => {
      const o = ctx!.createOscillator()
      const g = ctx!.createGain()
      o.type = type
      o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t0 + i * gap)
      g.gain.exponentialRampToValueAtTime(0.18, t0 + i * gap + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * gap + dur)
      o.connect(g).connect(ctx!.destination)
      o.start(t0 + i * gap)
      o.stop(t0 + i * gap + dur + 0.02)
    })
  } catch {
    /* audio not available */
  }
}

export const sfx = {
  right: () => tone([660, 880], 0.14, 'sine'),
  wrong: () => tone([220, 180], 0.16, 'triangle', 0.11),
  done: () => tone([523, 659, 784, 1046], 0.18, 'sine', 0.1),
}

export function celebrate() {
  const colors = ['#6246ea', '#2ec4b6', '#ff6b6b', '#ffbe0b']
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors })
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0 }, colors }), 200)
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1 }, colors }), 350)
}
