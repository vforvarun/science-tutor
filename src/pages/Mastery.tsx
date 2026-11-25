import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X, Check, ArrowRight, Lightbulb, LifeBuoy, PlayCircle, BookOpen, Timer, Flame, Target, Delete, RefreshCw, Trophy } from 'lucide-react'
import { TOPICS, STRANDS, topicById, type Topic, type Strand } from '../data/topics'
import { SCENES } from '../scenes'
import { useStore } from '../lib/store'
import { updateSmart, difficultyFor, zoneFor, diagnose, PERFECT } from '../lib/smart'
import { shuffle } from '../lib/num'
import { unlockAudio } from '../lib/speech'
import type { Gen, Problem, Level } from '../lib/problem'
import { sfx, celebrate } from '../lib/fx'
import { Page, PageHeader, Card, Button, Ring } from '../components/ui'
import { MathText, TeX } from '../components/MathText'
import { Figure } from '../components/Figure'
import { ScenePlayer } from '../components/ScenePlayer'
import { answerText, check, coarse, KEYS } from '../components/ProblemRunner'

// ---------------- Overview ----------------

function Medal({ score }: { score: number }) {
  if (score >= 100) return <span title="Mastered">🏆</span>
  if (score >= 90) return <span title="Challenge Zone">🔥</span>
  if (score >= 75) return <span title="Almost there">🥈</span>
  if (score >= 40) return <span title="Improving">🥉</span>
  return null
}

export function MasteryHome() {
  const s = useStore()
  const [filter, setFilter] = useState<0 | 9 | 10>(0)
  const all = TOPICS.filter((t) => !filter || t.level === filter)
  const perfect = TOPICS.filter((t) => (s.smart[t.id]?.best ?? 0) >= 100).length
  const total = Object.values(s.smart).reduce((a, x) => a + x.answered, 0)
  const inProgress = TOPICS.filter((t) => (s.smart[t.id]?.score ?? 0) > 0 && (s.smart[t.id]?.score ?? 0) < 100).sort((a, b) => (s.smart[b.id]?.score ?? 0) - (s.smart[a.id]?.score ?? 0))
  return (
    <Page>
      <PageHeader
        title="Master it"
        subtitle="Unlimited practice until you’re perfect — reach a SmartScore of 100"
        emoji="💯"
        right={
          <div className="flex rounded-2xl bg-white p-1 shadow-[var(--shadow-card)]">
            {([0, 9, 10] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${filter === f ? 'bg-violet text-white' : 'text-ink-soft'}`}>
                {f === 0 ? 'All' : `Yr ${f}`}
              </button>
            ))}
          </div>
        }
      />

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink via-[#2f2b66] to-violet p-6 text-white shadow-[var(--shadow-lift)]">
        <div className="pointer-events-none absolute -right-4 -top-8 font-display text-[10rem] font-bold leading-none text-white/10">100</div>
        <div className="relative grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl font-bold">How it works</h2>
            <ul className="mt-2 space-y-1.5 font-medium text-white/85">
              <li>✅ Correct answers raise your SmartScore — big jumps at first, smaller as you get close to 100.</li>
              <li>🔥 At 90 you enter the <b className="text-sun">Challenge Zone</b>: harder questions, and mistakes cost more.</li>
              <li>💡 Get one wrong? You’ll see why, step by step — then try a similar one.</li>
              <li>🏆 Reach 100 to master the topic. Keep going as long as you like — questions never run out.</li>
            </ul>
          </div>
          <div className="flex gap-3 sm:flex-col">
            <div className="rounded-2xl bg-white/12 px-4 py-3 text-center">
              <div className="font-display text-3xl font-bold">{perfect}</div>
              <div className="text-xs text-white/75">topics at 100</div>
            </div>
            <div className="rounded-2xl bg-white/12 px-4 py-3 text-center">
              <div className="font-display text-3xl font-bold">{total}</div>
              <div className="text-xs text-white/75">questions done</div>
            </div>
          </div>
        </div>
      </div>

      {inProgress.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-xl font-bold">Keep going</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {inProgress.slice(0, 6).map((t) => (
              <Link key={t.id} to={`/master/${t.id}`} className="card lift flex min-w-56 items-center gap-3 p-3">
                <Ring value={(s.smart[t.id]?.score ?? 0) / 100} size={52} stroke={6} color={zoneFor(s.smart[t.id]?.score ?? 0).color}>
                  <span className="text-sm font-bold">{s.smart[t.id]?.score}</span>
                </Ring>
                <div>
                  <div className="font-semibold leading-tight">{t.title}</div>
                  <div className="text-xs text-ink-soft">{zoneFor(s.smart[t.id]?.score ?? 0).name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(Object.keys(STRANDS) as Strand[]).map((st) => {
        const list = all.filter((t) => t.strand === st)
        if (!list.length) return null
        return (
          <section key={st} className="mt-7">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
              <span className={`hue-${st} grid h-9 w-9 place-items-center rounded-xl text-lg`}>{STRANDS[st].emoji}</span>
              {STRANDS[st].name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => {
                const sm = s.smart[t.id]
                const score = sm?.score ?? 0
                return (
                  <Link key={t.id} to={`/master/${t.id}`} className="card lift flex items-center gap-3 p-4">
                    <div className={`hue-${t.strand} grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl`}>{t.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 font-semibold leading-tight">
                        {t.title} <Medal score={sm?.best ?? 0} />
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-black/[0.07]">
                        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: zoneFor(score).color }} />
                      </div>
                      <div className="mt-1 flex justify-between text-[11px] font-medium text-ink-soft">
                        <span>SmartScore {score}</span>
                        <span>{sm ? `${sm.answered} done` : `Yr ${t.level}`}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </Page>
  )
}

// ---------------- Session ----------------

interface Q {
  p: Problem
  gen: number
  diff: Level
}

function pickGen(t: Topic, stats: { r: number; w: number }[], last: number): number {
  // favour the skills you're getting wrong, and vary between skills
  const weights = t.gens.map((_, i) => Math.max(0.4, 1 + stats[i].w * 1.5 - stats[i].r * 0.3) * (i === last && t.gens.length > 1 ? 0.5 : 1))
  let r = Math.random() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return 0
}

function HelpPanel({ t, onWatch }: { t: Topic; onWatch: () => void }) {
  const ex = t.examples[0]
  const [shown, setShown] = useState(1)
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4 overflow-hidden rounded-3xl border-2 border-sky/30 bg-white shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 bg-sky-soft px-5 py-3 font-semibold text-[#1f5fd1]">
        <LifeBuoy size={18} /> Need a hand? Let’s go back to the idea.
      </div>
      <div className="space-y-4 p-5">
        <div className="flex gap-3">
          <span className="text-3xl">{t.analogy.emoji}</span>
          <div>
            <div className="font-semibold">{t.analogy.title}</div>
            <div className="text-sm text-ink-soft">
              <MathText text={t.analogy.text} />
            </div>
          </div>
        </div>
        {t.formulas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {t.formulas.slice(0, 3).map((f) => (
              <span key={f} className="rounded-xl bg-violet-soft/70 px-3 py-1.5">
                <TeX tex={f} />
              </span>
            ))}
          </div>
        ) : (
          <div className="grid gap-1.5 sm:grid-cols-2">
            {t.terms.slice(0, 4).map(([term, def]) => (
              <div key={term} className="rounded-xl bg-violet-soft/60 px-3 py-2 text-sm">
                <b>{term}</b> — {def}
              </div>
            ))}
          </div>
        )}
        {ex && (
          <div className="rounded-2xl bg-cream p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-violet">Worked example</div>
            <div className="mt-1 font-medium">
              <MathText text={ex.q} />
            </div>
            <ol className="mt-2 space-y-1">
              {ex.steps.slice(0, shown).map((s, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="font-semibold text-violet">{i + 1}.</span>
                  <MathText text={s} />
                </li>
              ))}
            </ol>
            {shown < ex.steps.length && (
              <button onClick={() => setShown(shown + 1)} className="mt-2 text-sm font-semibold text-violet">
                Next step →
              </button>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {SCENES[t.scene] && (
            <Button variant="soft" className="px-3 py-2 text-sm" onClick={onWatch}>
              <PlayCircle size={16} /> Watch the animation
            </Button>
          )}
          <Link to={`/topic/${t.id}`} className="inline-flex items-center gap-2 rounded-2xl bg-cream px-3 py-2 text-sm font-semibold">
            <BookOpen size={16} /> Read the full lesson
          </Link>
        </div>
        <div className="text-sm text-ink-soft">I’ve made the next questions a bit easier while you get back on track. 💪</div>
      </div>
    </motion.div>
  )
}

export function MasterySession() {
  const { id } = useParams()
  const nav = useNavigate()
  const t = topicById(id!)
  const store = useStore()
  const startScore = store.smart[id!]?.score ?? 0
  const [score, setScore] = useState(startScore)
  const [stats, setStats] = useState(() => (t ? t.gens.map(() => ({ r: 0, w: 0 })) : []))
  const [missRun, setMissRun] = useState(0)
  const [hitRun, setHitRun] = useState(0)
  const [bestRun, setBestRun] = useState(0)
  const [session, setSession] = useState({ answered: 0, right: 0, secs: 0, rightSecs: 0 })
  const [q, setQ] = useState<Q | null>(null)
  const [vals, setVals] = useState<string[]>([''])
  const [focus, setFocus] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [fb, setFb] = useState<{ ok: boolean; why: string | null; delta: number } | null>(null)
  const [steps, setSteps] = useState(0)
  const [hint, setHint] = useState(false)
  const [watch, setWatch] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [perfect, setPerfect] = useState(false)
  const [shake, setShake] = useState(false)
  const [, tick] = useState(0)
  const qStart = useRef(Date.now())
  const sessStart = useRef(Date.now())
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const newQuestion = (sameGen?: number, sc = score, miss = missRun) => {
    if (!t) return
    const g = sameGen ?? pickGen(t, stats, q?.gen ?? -1)
    let d = difficultyFor(sc)
    if (miss >= 2 && d > 1) d = (d - 1) as Level
    const p = (t.gens[g] as Gen)(d)
    setQ({ p, gen: g, diff: d })
    setVals(p.kind === 'multi' ? p.fields!.map(() => '') : [''])
    setChoice(null)
    setFb(null)
    setSteps(0)
    setHint(false)
    setFocus(0)
    qStart.current = Date.now()
    if (!coarse) setTimeout(() => inputs.current[0]?.focus(), 60)
  }

  useEffect(() => {
    newQuestion()
    const iv = setInterval(() => tick((x) => x + 1), 1000)
    return () => clearInterval(iv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const order = useMemo(() => (q?.p.kind === 'mcq' ? shuffle(q.p.options!.map((_, k) => k)) : []), [q])

  if (!t) return null
  const zone = zoneFor(score)

  const submit = (forced?: number) => {
    if (!q || fb) return
    const p = q.p
    const c = forced ?? choice
    if (p.kind === 'mcq' && c === null) return
    if (p.kind !== 'mcq' && !vals.every((v) => v.trim())) return
    const ok = check(p, vals, c)
    const secs = Math.round((Date.now() - qStart.current) / 1000)
    const before = score
    const after = updateSmart(before, ok)
    setScore(after)
    setFb({ ok, why: ok ? null : diagnose(p, vals, t.id), delta: after - before })
    setStats((st) => st.map((x, i) => (i === q.gen ? { r: x.r + (ok ? 1 : 0), w: x.w + (ok ? 0 : 1) } : x)))
    setSession((s) => ({ answered: s.answered + 1, right: s.right + (ok ? 1 : 0), secs: s.secs + secs, rightSecs: s.rightSecs + (ok ? secs : 0) }))
    store.smartAnswer(t.id, after, ok, secs)
    store.answer(t.id, ok, q.diff)
    if (session.answered + 1 === 10) store.completeTask('practise')
    if (ok) {
      store.addXp(2 * q.diff)
      setMissRun(0)
      setHitRun((h) => {
        setBestRun((b) => Math.max(b, h + 1))
        return h + 1
      })
      sfx.right()
    } else {
      setMissRun((m) => m + 1)
      setHitRun(0)
      setSteps(1)
      sfx.wrong()
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
    // milestones
    const crossed = [40, 75, 90].find((m) => before < m && after >= m)
    if (crossed) {
      setToast(crossed === 90 ? '🔥 Challenge Zone unlocked! Harder questions ahead.' : crossed === 75 ? '🚀 75 — almost there!' : '📈 40 — you’re improving! Questions get a bit harder now.')
      setTimeout(() => setToast(null), 3500)
    }
    if (after >= PERFECT && before < PERFECT) {
      setTimeout(() => {
        celebrate()
        sfx.done()
        setPerfect(true)
        store.addXp(50)
        store.completeTask('practise')
      }, 600)
    }
  }

  const next = (similar = false) => newQuestion(similar ? q!.gen : undefined, score, missRun)

  const press = (k: string) => {
    if (fb) return
    setVals((v) => v.map((x, i) => (i === focus ? (k === 'del' ? x.slice(0, -1) : x + (k === '−' ? '-' : k)) : x)))
  }

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (perfect || watch || !q) return
      if (e.key === 'Enter') {
        e.preventDefault()
        if (fb) next(!fb.ok)
        else submit()
      } else if (q.p.kind === 'mcq' && !fb) {
        const n = parseInt(e.key)
        if (n >= 1 && n <= order.length) {
          setChoice(order[n - 1])
          submit(order[n - 1])
        }
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const elapsed = Math.floor((Date.now() - sessStart.current) / 1000)
  const mmss = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`
  const avg = session.right ? Math.round(session.rightSecs / session.right) : 0
  const p = q?.p

  return (
    <Page className="max-w-6xl">
      {/* top bar */}
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => nav('/master')} aria-label="Exit" className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-black/5">
          <X size={22} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-xl font-bold">
            {t.emoji} {t.title}
          </div>
          <div className="text-xs font-semibold" style={{ color: zone.color }}>
            {zone.emoji} {zone.name}
          </div>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Ring value={score / 100} size={54} stroke={6} color={zone.color}>
            <span className="text-sm font-bold">{score}</span>
          </Ring>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_17rem]">
        <div>
          {p && q && (
            <AnimatePresence mode="wait">
              <motion.div key={session.answered + '-' + q.gen + p.q} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className={`card p-5 sm:p-7 ${shake ? 'wiggle' : ''}`}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-violet">Question {session.answered + (fb ? 0 : 1)}</span>
                  <span className="ml-auto flex gap-0.5" title={`Difficulty ${q.diff}`}>
                    {[1, 2, 3].map((d) => (
                      <span key={d} className={`h-2 w-4 rounded-full ${d <= q.diff ? 'bg-sun' : 'bg-black/10'}`} />
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
                      return (
                        <button
                          key={k}
                          disabled={!!fb}
                          onClick={() => {
                            setChoice(k)
                            submit(k)
                          }}
                          className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-lg font-medium transition-all ${isRight ? 'border-mint bg-mint-soft' : isWrong ? 'border-coral bg-coral-soft' : 'border-line bg-white shadow-[0_4px_0_0_var(--color-line)] hover:border-violet/40 active:translate-y-[3px] active:shadow-none'}`}
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
                  </div>
                )}

                {!fb && (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {p.kind !== 'mcq' && (
                      <Button className="flex-1" disabled={!vals.every((v) => v.trim())} onClick={() => submit()}>
                        Check
                      </Button>
                    )}
                    {p.hint && !hint && (
                      <Button variant="soft" onClick={() => setHint(true)}>
                        <Lightbulb size={18} /> Hint
                      </Button>
                    )}
                  </div>
                )}
                {hint && !fb && p.hint && (
                  <div className="mt-3 rounded-2xl bg-sun-soft p-3 font-medium text-[#7a5500]">
                    💡 <MathText text={p.hint} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* feedback */}
          <AnimatePresence>
            {fb && p && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 rounded-3xl p-5 ${fb.ok ? 'bg-mint-soft' : 'bg-coral-soft'}`}>
                <div className="flex flex-wrap items-center gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-full text-white ${fb.ok ? 'bg-mint' : 'bg-coral'}`}>{fb.ok ? <Check size={26} strokeWidth={3} /> : <X size={26} strokeWidth={3} />}</div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-display text-xl font-bold ${fb.ok ? 'text-mint-deep' : 'text-coral-deep'}`}>
                      {fb.ok ? (hitRun >= 5 ? `${hitRun} in a row! 🔥` : 'Correct!') : 'Not quite.'}{' '}
                      {fb.delta !== 0 && (
                        <span className="text-base font-semibold opacity-80">
                          SmartScore {fb.delta > 0 ? '+' : '−'}
                          {Math.abs(fb.delta)}
                        </span>
                      )}
                    </div>
                    {!fb.ok && (
                      <div className="font-medium">
                        Correct answer: <MathText text={answerText(p)} />
                      </div>
                    )}
                  </div>
                  <div className="flex w-full gap-2 sm:w-auto">
                    {fb.ok ? (
                      <Button variant="success" className="flex-1" onClick={() => next()} autoFocus>
                        Next <ArrowRight size={18} />
                      </Button>
                    ) : (
                      <>
                        <Button variant="danger" className="flex-1" onClick={() => next(true)} autoFocus>
                          <RefreshCw size={16} /> Try a similar one
                        </Button>
                        <Button variant="secondary" onClick={() => next()}>
                          Skip
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {fb.why && (
                  <div className="mt-4 flex gap-3 rounded-2xl bg-white/80 p-4">
                    <Target className="shrink-0 text-coral-deep" size={20} />
                    <div className="font-medium">
                      <MathText text={fb.why} />
                    </div>
                  </div>
                )}
                <div className="mt-4 rounded-2xl bg-white/80 p-4">
                  {steps === 0 ? (
                    <button onClick={() => setSteps(p.steps.length)} className="text-sm font-semibold text-violet">
                      See the worked solution →
                    </button>
                  ) : (
                    <>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet">{fb.ok ? 'Worked solution' : 'Here’s how to do it'}</div>
                      <ol className="space-y-2">
                        {p.steps.slice(0, steps).map((s, k) => (
                          <motion.li key={k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet text-xs font-semibold text-white">{k + 1}</span>
                            <span className="font-medium">
                              <MathText text={s} />
                            </span>
                          </motion.li>
                        ))}
                      </ol>
                      {steps < p.steps.length && (
                        <button onClick={() => setSteps(steps + 1)} className="mt-3 rounded-xl bg-violet-soft px-3 py-1.5 text-sm font-semibold text-violet-deep">
                          Next step →
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {missRun >= 2 && <HelpPanel t={t} onWatch={() => (unlockAudio(), setWatch(true))} />}
        </div>

        {/* sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
          <Card className="p-5 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">SmartScore</div>
            <div className="mt-2 flex justify-center">
              <Ring value={score / 100} size={140} stroke={14} color={zone.color}>
                <div>
                  <motion.div key={score} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="font-display text-4xl font-bold">
                    {score}
                  </motion.div>
                  <div className="text-[11px] font-semibold text-ink-soft">/ 100</div>
                </div>
              </Ring>
            </div>
            <div className="mt-2 font-semibold" style={{ color: zone.color }}>
              {zone.emoji} {zone.name}
            </div>
            <div className="mt-1 text-sm text-ink-soft">{zone.blurb}</div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gradient-to-r from-violet via-sky via-60% to-coral opacity-25" />
            <div className="mt-1 flex justify-between text-[10px] font-semibold text-ink-soft">
              <span>0</span>
              <span>40</span>
              <span>75</span>
              <span>90🔥</span>
              <span>100</span>
            </div>
          </Card>
          <Card className="grid grid-cols-2 gap-3 p-4 text-center">
            <div className="rounded-2xl bg-cream p-2">
              <div className="font-display text-2xl font-bold">{session.answered}</div>
              <div className="text-[11px] text-ink-soft">answered</div>
            </div>
            <div className="rounded-2xl bg-cream p-2">
              <div className="font-display text-2xl font-bold">{session.answered ? Math.round((session.right / session.answered) * 100) : 0}%</div>
              <div className="text-[11px] text-ink-soft">accuracy</div>
            </div>
            <div className="rounded-2xl bg-cream p-2">
              <div className="flex items-center justify-center gap-1 font-display text-2xl font-bold">
                <Flame size={18} className="text-[#ff8a00]" /> {hitRun}
              </div>
              <div className="text-[11px] text-ink-soft">in a row (best {bestRun})</div>
            </div>
            <div className="rounded-2xl bg-cream p-2">
              <div className="flex items-center justify-center gap-1 font-display text-2xl font-bold">
                <Timer size={18} className="text-violet" /> {mmss}
              </div>
              <div className="text-[11px] text-ink-soft">{avg ? `~${avg}s per correct` : 'time'}</div>
            </div>
          </Card>
          {stats.length > 1 && <Card className="p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">Skills this session</div>
            <div className="space-y-1.5">
              {stats.map((st, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-28 truncate text-ink-soft">{t.skills[i] ?? `Skill ${i + 1}`}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.07]">
                    <div className="h-full rounded-full bg-mint" style={{ width: `${st.r + st.w ? (st.r / (st.r + st.w)) * 100 : 0}%` }} />
                  </div>
                  <span className="w-10 text-right text-xs font-semibold">
                    {st.r}/{st.r + st.w}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-ink-soft">Skills you miss come up more often.</div>
          </Card>}
        </aside>
      </div>

      {/* milestone toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl bg-ink px-5 py-3 font-semibold text-white shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* animation modal */}
      <AnimatePresence>
        {watch && SCENES[t.scene] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" onClick={() => setWatch(false)}>
            <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 flex justify-end">
                <button onClick={() => setWatch(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white" aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              <ScenePlayer scene={SCENES[t.scene]} autoStart onComplete={() => store.markWatched(t.id)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* perfect! */}
      <AnimatePresence>
        {perfect && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring' }} className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl">
              <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-7xl">
                🏆
              </motion.div>
              <h2 className="mt-3 text-3xl font-bold">SmartScore 100!</h2>
              <p className="mt-1 font-medium text-ink-soft">You’ve mastered {t.title}. That’s real hard work paying off.</p>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-cream p-3">
                  <div className="font-display text-2xl font-bold">{session.answered}</div>
                  <div className="text-[11px] text-ink-soft">questions</div>
                </div>
                <div className="rounded-2xl bg-cream p-3">
                  <div className="font-display text-2xl font-bold">{Math.round((session.right / Math.max(1, session.answered)) * 100)}%</div>
                  <div className="text-[11px] text-ink-soft">accuracy</div>
                </div>
                <div className="rounded-2xl bg-cream p-3">
                  <div className="font-display text-2xl font-bold">{mmss}</div>
                  <div className="text-[11px] text-ink-soft">time</div>
                </div>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-sun-soft px-3 py-1 text-sm font-semibold text-sun-deep">
                <Trophy size={14} /> +50 XP bonus
              </div>
              <div className="mt-6 grid gap-2">
                {(() => {
                  const nextT = TOPICS.filter((x) => x.level <= store.profile.level).find((x) => (store.smart[x.id]?.best ?? 0) < 100 && x.id !== t.id)
                  return nextT ? (
                    <Button
                      onClick={() => {
                        setPerfect(false)
                        nav(`/master/${nextT.id}`)
                      }}
                    >
                      Next: {nextT.emoji} {nextT.title} <ArrowRight size={18} />
                    </Button>
                  ) : null
                })()}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPerfect(false)
                    next()
                  }}
                >
                  Keep practising this topic
                </Button>
                <Button variant="ghost" onClick={() => nav('/master')}>
                  Back to Master it
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
