import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, X, ArrowRight, Lightbulb, ListOrdered, Delete, Sparkles, RotateCcw, Timer } from 'lucide-react'
import type { Level, Problem } from '../lib/problem'
import { parseNum, close, shuffle, fmt } from '../lib/num'
import { useStore } from '../lib/store'
import { sfx, celebrate } from '../lib/fx'
import { Button, Progress, Ring } from './ui'
import { MathText } from './MathText'
import { Figure } from './Figure'

export interface Item {
  p: Problem
  topic?: string
  diff: Level
}
export interface Result {
  item: Item
  ok: boolean
  given: string
}

interface Props {
  count: number
  make: (i: number) => Item // called lazily so adaptive difficulty can react
  mode?: 'practice' | 'test'
  title?: string
  timeLimit?: number // seconds, tests only
  onFinish?: (res: Result[]) => void
  onExit: () => void
  doneLabel?: string
}

export const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

export function answerText(p: Problem) {
  if (p.kind === 'mcq') return p.options![0]
  if (p.kind === 'num') return `$${fmt(p.ans!, 4).replace('−', '-')}$${p.unit ? ' ' + p.unit : ''}`
  return p.fields!.map((f) => `${f.label} = $${fmt(f.ans, 4).replace('−', '-')}$`).join(', ')
}

export function check(p: Problem, vals: string[], choice: number | null): boolean {
  const tol = p.tol ?? 0.011
  if (p.kind === 'mcq') return choice === 0
  if (p.kind === 'num') {
    const v = parseNum(vals[0] ?? '')
    return v !== null && close(v, p.ans!, tol)
  }
  const nums = vals.map(parseNum)
  if (nums.some((n) => n === null)) return false
  if (!p.unordered) return p.fields!.every((f, i) => close(nums[i]!, f.ans, tol))
  const pool = [...nums] as number[]
  return p.fields!.every((f) => {
    const k = pool.findIndex((n) => close(n, f.ans, tol))
    if (k < 0) return false
    pool.splice(k, 1)
    return true
  })
}

export const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '−', '0', '.']

export function ProblemRunner({ count, make, mode = 'practice', title, timeLimit, onFinish, onExit, doneLabel = 'Done' }: Props) {
  const [i, setI] = useState(0)
  const [item, setItem] = useState<Item>(() => make(0))
  const [vals, setVals] = useState<string[]>([''])
  const [focus, setFocus] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [fb, setFb] = useState<{ ok: boolean } | null>(null)
  const [showSteps, setShowSteps] = useState(0)
  const [hint, setHint] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [done, setDone] = useState(false)
  const [shake, setShake] = useState(false)
  const [start] = useState(Date.now())
  const [, tick] = useState(0)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const { answer, addXp } = useStore()
  const p = item.p
  const order = useMemo(() => (p.kind === 'mcq' ? shuffle(p.options!.map((_, k) => k)) : []), [p])

  useEffect(() => {
    setVals(p.kind === 'multi' ? p.fields!.map(() => '') : [''])
    setChoice(null)
    setFb(null)
    setShowSteps(0)
    setHint(false)
    setFocus(0)
    if (!coarse) setTimeout(() => inputs.current[0]?.focus(), 60)
  }, [p])

  useEffect(() => {
    if (!timeLimit) return
    const iv = setInterval(() => tick((x) => x + 1), 1000)
    return () => clearInterval(iv)
  }, [timeLimit])
  const remaining = timeLimit ? Math.max(0, timeLimit - Math.floor((Date.now() - start) / 1000)) : 0
  useEffect(() => {
    if (timeLimit && remaining === 0 && !done) finish(results)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  const ready = p.kind === 'mcq' ? choice !== null : vals.every((v) => v.trim() !== '')

  const submit = (forcedChoice?: number) => {
    if (fb) return
    const c = forcedChoice ?? choice
    if (p.kind === 'mcq' && c === null) return
    if (p.kind !== 'mcq' && !vals.every((v) => v.trim())) return
    const ok = check(p, vals, c)
    const given = p.kind === 'mcq' ? p.options![c!] : vals.join(', ')
    const res = [...results, { item, ok, given }]
    setResults(res)
    if (item.topic) answer(item.topic, ok, item.diff)
    if (ok) addXp(3 * item.diff)
    if (mode === 'test') {
      advance(res)
      return
    }
    setFb({ ok })
    if (ok) sfx.right()
    else {
      sfx.wrong()
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  const advance = (res = results) => {
    if (i + 1 >= count) finish(res)
    else {
      setI(i + 1)
      setItem(make(i + 1))
    }
  }

  const finish = (res: Result[]) => {
    setDone(true)
    const pct = res.length ? res.filter((r) => r.ok).length / res.length : 0
    sfx.done()
    if (pct >= 0.8) celebrate()
    onFinish?.(res)
  }

  const press = (k: string) => {
    if (fb) return
    setVals((v) => {
      const n = [...v]
      const cur = n[focus] ?? ''
      n[focus] = k === 'del' ? cur.slice(0, -1) : cur + (k === '−' ? '-' : k)
      return n
    })
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (done) return
      if (e.key === 'Enter') {
        e.preventDefault()
        if (fb) advance()
        else submit()
        return
      }
      if (p.kind === 'mcq' && !fb) {
        const n = parseInt(e.key)
        if (n >= 1 && n <= order.length) {
          setChoice(order[n - 1])
          if (mode === 'practice') submit(order[n - 1])
        }
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  if (done) {
    const right = results.filter((r) => r.ok).length
    const pct = results.length ? right / results.length : 0
    const wrong = results.filter((r) => !r.ok)
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto max-w-xl p-6 text-center sm:p-8">
        <div className="text-5xl">{pct >= 0.9 ? '🏆' : pct >= 0.7 ? '🎉' : pct >= 0.5 ? '💪' : '🌱'}</div>
        <h2 className="mt-2 text-3xl font-bold">{pct >= 0.9 ? 'Outstanding!' : pct >= 0.7 ? 'Great work!' : pct >= 0.5 ? 'Good effort!' : 'Keep practising!'}</h2>
        <div className="mt-5 flex justify-center">
          <Ring value={pct} size={130} stroke={14} color={pct >= 0.7 ? '#2ec4b6' : pct >= 0.5 ? '#ffbe0b' : '#ff6b6b'}>
            <div>
              <div className="font-display text-3xl font-bold">{Math.round(pct * 100)}%</div>
              <div className="text-xs font-semibold text-ink-soft">
                {right} / {results.length}
              </div>
            </div>
          </Ring>
        </div>
        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-sun-soft px-3 py-1 font-semibold text-sun-deep">
          <Sparkles size={16} /> +{results.filter((r) => r.ok).reduce((a, r) => a + 3 * r.item.diff, 0)} XP
        </div>
        {wrong.length > 0 && (
          <div className="mt-6 space-y-3 text-left">
            <div className="font-semibold text-ink-soft">Learn from these</div>
            {wrong.map((r, k) => (
              <details key={k} className="rounded-2xl bg-coral-soft/60 p-3">
                <summary className="cursor-pointer font-medium">
                  <MathText text={r.item.p.q} />
                </summary>
                <div className="mt-2 text-sm">
                  You: <span className="text-coral-deep line-through">{r.given || '—'}</span> · Answer: <MathText className="font-semibold text-mint-deep" text={answerText(r.item.p)} />
                </div>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                  {r.item.p.steps.map((s, j) => (
                    <li key={j}>
                      <MathText text={s} />
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {mode === 'practice' && (
            <Button
              variant="secondary"
              onClick={() => {
                setResults([])
                setI(0)
                setItem(make(0))
                setDone(false)
              }}
            >
              <RotateCcw size={18} /> Another round
            </Button>
          )}
          <Button onClick={onExit}>{doneLabel}</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={onExit} aria-label="Quit" className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-black/5">
          <X size={22} />
        </button>
        <Progress value={i / count} color="bg-gradient-to-r from-violet to-mint" />
        <div className="text-sm font-semibold tabular-nums text-ink-soft">
          {i + 1}/{count}
        </div>
        {timeLimit ? (
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${remaining < 60 ? 'bg-coral text-white' : 'bg-white shadow-[var(--shadow-card)]'}`}>
            <Timer size={14} /> {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
          </span>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }} className={`card p-5 sm:p-7 ${shake ? 'wiggle' : ''}`}>
          <div className="mb-2 flex items-center gap-2">
            {title && <span className="text-xs font-semibold uppercase tracking-wider text-violet">{title}</span>}
            <span className="ml-auto flex gap-0.5" title={`Difficulty ${item.diff}`}>
              {[1, 2, 3].map((d) => (
                <span key={d} className={`h-2 w-4 rounded-full ${d <= item.diff ? 'bg-sun' : 'bg-black/10'}`} />
              ))}
            </span>
          </div>
          <div className="text-xl font-medium leading-relaxed sm:text-[1.35rem]">
            <MathText text={p.q} />
          </div>
          {p.fig && (
            <div className="mt-4 rounded-2xl bg-cream p-3">
              <Figure fig={p.fig} />
            </div>
          )}

          {p.kind === 'mcq' && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {order.map((k, n) => {
                const isRight = fb && k === 0
                const isWrong = fb && choice === k && k !== 0
                const sel = !fb && choice === k
                return (
                  <button
                    key={k}
                    disabled={!!fb}
                    onClick={() => {
                      setChoice(k)
                      if (mode === 'practice') submit(k)
                    }}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-lg font-medium transition-all ${isRight ? 'border-mint bg-mint-soft' : isWrong ? 'border-coral bg-coral-soft' : sel ? 'border-violet bg-violet-soft' : 'border-line bg-white shadow-[0_4px_0_0_var(--color-line)] hover:border-violet/40 active:translate-y-[3px] active:shadow-none'}`}
                  >
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm ${isRight ? 'bg-mint text-white' : isWrong ? 'bg-coral text-white' : 'bg-cream text-ink-soft'}`}>{isRight ? <Check size={16} /> : isWrong ? <X size={16} /> : n + 1}</span>
                    <MathText text={p.options![k]} />
                  </button>
                )
              })}
            </div>
          )}

          {p.kind !== 'mcq' && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-3">
                {(p.kind === 'multi' ? p.fields! : [{ label: '' }]).map((f, k) => (
                  <label key={k} className="flex min-w-[9rem] flex-1 items-center gap-2">
                    {f.label && <span className="font-display text-lg font-semibold text-ink-soft">{f.label} =</span>}
                    <input
                      ref={(el) => {
                        inputs.current[k] = el
                      }}
                      value={vals[k] ?? ''}
                      onFocus={() => setFocus(k)}
                      onChange={(e) => setVals((v) => v.map((x, j) => (j === k ? e.target.value : x)))}
                      inputMode={coarse ? 'none' : 'decimal'}
                      disabled={!!fb}
                      autoComplete="off"
                      placeholder="?"
                      className={`w-full rounded-2xl border-2 bg-cream/60 px-4 py-3.5 text-2xl font-semibold tabular-nums outline-none transition focus:border-violet focus:bg-white ${fb ? (fb.ok ? 'border-mint bg-mint-soft' : 'border-coral bg-coral-soft') : focus === k ? 'border-violet' : 'border-line'}`}
                    />
                    {p.unit && <span className="font-semibold text-ink-soft">{p.unit}</span>}
                  </label>
                ))}
              </div>
              {!fb && (
                <div className={`mt-4 grid gap-2 ${coarse ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-8'}`}>
                  {(coarse ? [...KEYS.slice(0, 3), 'del', ...KEYS.slice(3, 6), '/', ...KEYS.slice(6)] : ['−', '/', '.']).map((k) => (
                    <button key={k} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => press(k)} className="grid h-12 place-items-center rounded-xl border-2 border-line bg-white text-xl font-semibold shadow-[0_3px_0_0_var(--color-line)] active:translate-y-[2px] active:shadow-none">
                      {k === 'del' ? <Delete size={20} /> : k}
                    </button>
                  ))}
                </div>
              )}
              {!coarse && !fb && <div className="mt-2 text-xs font-medium text-ink-soft">Tip: fractions like 3/4 and negatives like −2 are fine. Press Enter to check.</div>}
            </div>
          )}

          {!fb && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {(p.kind !== 'mcq' || mode === 'test') && (
                <Button className="flex-1" disabled={!ready} onClick={() => submit()}>
                  {mode === 'test' ? 'Next' : 'Check'}
                </Button>
              )}
              {mode === 'practice' && p.hint && (
                <Button variant="soft" onClick={() => setHint(true)}>
                  <Lightbulb size={18} /> Hint
                </Button>
              )}
            </div>
          )}
          <AnimatePresence>
            {hint && !fb && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 overflow-hidden rounded-2xl bg-sun-soft p-3 font-medium text-[#7a5500]">
                💡 <MathText text={p.hint!} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {fb && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 rounded-3xl p-5 ${fb.ok ? 'bg-mint-soft' : 'bg-coral-soft'}`}>
            <div className="flex flex-wrap items-center gap-4">
              <div className={`grid h-12 w-12 place-items-center rounded-full text-white ${fb.ok ? 'bg-mint' : 'bg-coral'}`}>{fb.ok ? <Check size={26} strokeWidth={3} /> : <X size={26} strokeWidth={3} />}</div>
              <div className="min-w-0 flex-1">
                <div className={`font-display text-xl font-bold ${fb.ok ? 'text-mint-deep' : 'text-coral-deep'}`}>{fb.ok ? pickPraise() : 'Not quite — let’s see why'}</div>
                {!fb.ok && (
                  <div className="font-medium">
                    Answer: <MathText text={answerText(p)} />
                  </div>
                )}
              </div>
              <Button variant={fb.ok ? 'success' : 'danger'} onClick={() => advance()} className="w-full sm:w-auto" autoFocus>
                Continue <ArrowRight size={18} />
              </Button>
            </div>
            <div className="mt-4">
              {showSteps === 0 ? (
                <button onClick={() => setShowSteps(fb.ok ? p.steps.length : 1)} className="inline-flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm font-semibold">
                  <ListOrdered size={16} /> {fb.ok ? 'See the worked solution' : 'Show me step by step'}
                </button>
              ) : (
                <div className="rounded-2xl bg-white/80 p-4">
                  <ol className="space-y-2">
                    {p.steps.slice(0, showSteps).map((s, k) => (
                      <motion.li key={k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet text-xs font-semibold text-white">{k + 1}</span>
                        <span className="font-medium">
                          <MathText text={s} />
                        </span>
                      </motion.li>
                    ))}
                  </ol>
                  {showSteps < p.steps.length && (
                    <button onClick={() => setShowSteps(showSteps + 1)} className="mt-3 rounded-xl bg-violet-soft px-3 py-1.5 text-sm font-semibold text-violet-deep">
                      Next step →
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const PRAISE = ['Brilliant!', 'Nailed it!', 'Correct!', 'Spot on!', 'Excellent!', 'Yes! 🎯', 'Too easy!']
function pickPraise() {
  return PRAISE[Math.floor(Math.random() * PRAISE.length)]
}
