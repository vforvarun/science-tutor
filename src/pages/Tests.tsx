import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Zap, Timer, Target, Layers, Trash2, Plus, CalendarClock } from 'lucide-react'
import { TOPICS, topicById, type Topic } from '../data/topics'
import { warmupQuestion } from '../gens/warmup'
import { useStore, topicState, todayKey, daysUntil, type Assessment } from '../lib/store'
import { pick } from '../lib/num'
import type { Level } from '../lib/problem'
import { Page, PageHeader, Card, Button } from '../components/ui'
import { ProblemRunner, type Result } from '../components/ProblemRunner'

export function WarmupPage() {
  const [go, setGo] = useState(false)
  const nav = useNavigate()
  const s = useStore()
  if (go) {
    return (
      <Page>
        <ProblemRunner
          count={10}
          title="Warm-up"
          make={() => ({ p: warmupQuestion(useStore.getState().profile.level), diff: 1 })}
          onFinish={(res) => {
            const score = res.filter((r) => r.ok).length
            s.saveWarmup(score)
            s.completeTask('warmup')
            s.addXp(5)
          }}
          onExit={() => setGo(false)}
        />
      </Page>
    )
  }
  return (
    <Page>
      <PageHeader title="Quick-fire" subtitle="Key terms and quick facts to switch your brain on" emoji="⚡" />
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#ffb26b] to-coral p-8 text-white shadow-[var(--shadow-lift)]">
        <div className="pointer-events-none absolute -right-4 -bottom-10 font-display text-[10rem] font-bold leading-none opacity-15">⚗</div>
        <Zap size={36} />
        <h2 className="mt-2 text-3xl font-bold">10 quick questions</h2>
        <p className="mt-1 max-w-md font-medium text-white/90">Match key terms to their meanings and recall quick facts. Knowing the vocabulary is half the battle in science tests.</p>
        <div className="mt-4 font-semibold">Your best: {s.warmupBest}/10</div>
        <Button variant="secondary" className="mt-5" onClick={() => setGo(true)}>
          Start quick-fire
        </Button>
      </div>
      <Card className="mt-5 p-5">
        <div className="font-semibold">Why quick-fire?</div>
        <p className="mt-1 text-ink-soft">Science answers are marked on using the right words. A few minutes a day of key terms makes every topic easier — try to beat your best score!</p>
      </Card>
      <Button variant="ghost" className="mt-3" onClick={() => nav('/')}>
        ← Back to today
      </Button>
    </Page>
  )
}

export function TestsPage() {
  const s = useStore()
  const nav = useNavigate()
  const mine = TOPICS.filter((t) => t.level <= s.profile.level)
  const [sel, setSel] = useState<string[]>([])
  const history = [...s.exams].reverse().slice(0, 8)
  return (
    <Page>
      <PageHeader title="Tests" subtitle="Practise under test conditions and find your weak spots" emoji="📝" />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { to: '/test/quick', icon: Zap, title: 'Quick challenge', sub: '8 mixed questions, instant feedback', c: 'from-violet to-[#8a6dff]' },
          { to: '/test/mock', icon: Timer, title: 'Mock exam', sub: '20 questions · 40 minutes · all topics', c: 'from-ink to-[#3d3a70]' },
          { to: '#topic-test', icon: Target, title: 'Topic test', sub: 'Choose the topics on your next test', c: 'from-mint to-mint-deep' },
        ].map((x) => (
          <a
            key={x.title}
            href={x.to.startsWith('#') ? x.to : undefined}
            onClick={(e) => {
              if (!x.to.startsWith('#')) {
                e.preventDefault()
                nav(x.to)
              }
            }}
            className={`lift relative cursor-pointer overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${x.c} p-5 text-white shadow-md`}
          >
            <x.icon size={28} />
            <div className="mt-2 font-display text-2xl font-bold">{x.title}</div>
            <div className="font-medium text-white/80">{x.sub}</div>
          </a>
        ))}
      </div>

      <Card className="mt-6 p-5" >
        <div id="topic-test" className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Layers className="text-mint" /> Build a topic test
            </div>
            <div className="text-sm text-ink-soft">Pick the topics, then take a 15-question test.</div>
          </div>
          <Button variant="success" disabled={!sel.length} onClick={() => nav(`/test/topics?ids=${sel.join(',')}`)}>
            Start test ({sel.length})
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {mine.map((t) => {
            const on = sel.includes(t.id)
            return (
              <button key={t.id} onClick={() => setSel(on ? sel.filter((x) => x !== t.id) : [...sel, t.id])} className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition ${on ? 'border-mint bg-mint text-white' : 'border-line bg-white'}`}>
                {t.emoji} {t.title}
              </button>
            )
          })}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link to="/planner" className="card lift flex items-center gap-4 p-5">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-coral-soft text-coral">
            <CalendarClock />
          </div>
          <div>
            <div className="font-semibold">Term planner</div>
            <div className="text-sm text-ink-soft">Add your test dates — the daily plan will focus on those topics.</div>
          </div>
        </Link>
        <Card className="p-5">
          <div className="font-semibold">Recent results</div>
          {history.length === 0 ? (
            <div className="mt-1 text-sm text-ink-soft">No tests yet. Try a quick challenge!</div>
          ) : (
            <div className="mt-2 space-y-1.5">
              {history.map((e, i) => {
                const pct = Math.round((e.score / e.total) * 100)
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-20 text-ink-soft">{new Date(e.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                    <span className="flex-1 font-medium">{e.kind}</span>
                    <span className={`font-semibold ${pct >= 80 ? 'text-mint-deep' : pct >= 50 ? 'text-sun-deep' : 'text-coral-deep'}`}>{pct}%</span>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </Page>
  )
}

function summarise(res: Result[]) {
  const byTopic: Record<string, [number, number]> = {}
  res.forEach((r) => {
    if (!r.item.topic) return
    const cur = byTopic[r.item.topic] ?? [0, 0]
    byTopic[r.item.topic] = [cur[0] + (r.ok ? 1 : 0), cur[1] + 1]
  })
  return byTopic
}

export function TestRun() {
  const { kind } = useParams()
  const [params] = useSearchParams()
  const nav = useNavigate()
  const s = useStore()
  const [result, setResult] = useState<Record<string, [number, number]> | null>(null)

  const cfg = useMemo(() => {
    const level = s.profile.level
    const mine = TOPICS.filter((t) => t.level <= level)
    if (kind === 'mock') return { count: 20, mode: 'test' as const, time: 40 * 60, title: 'Mock exam', pool: mine, diff: () => pick([2, 2, 3]) as Level }
    if (kind === 'topics') {
      const ids = (params.get('ids') ?? '').split(',').filter(Boolean)
      const pool = ids.map((i) => topicById(i)).filter(Boolean) as Topic[]
      return { count: 15, mode: 'test' as const, time: 0, title: 'Topic test', pool: pool.length ? pool : mine, diff: () => pick([1, 2, 2, 3]) as Level }
    }
    const practised = mine.filter((t) => topicState(s, t.id).attempts > 0 || topicState(s, t.id).watched)
    return { count: 8, mode: 'practice' as const, time: 0, title: 'Quick challenge', pool: practised.length >= 2 ? practised : mine.slice(0, 6), diff: (t: Topic) => topicState(useStore.getState(), t.id).diff }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  // spread questions across topics
  const order = useMemo(() => Array.from({ length: cfg.count }, (_, i) => cfg.pool[i % cfg.pool.length]).sort(() => Math.random() - 0.5), [cfg])

  let breakdown = null
  if (result) {
    const entries = Object.entries(result).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])
    breakdown = (
        <Card className="mx-auto mt-5 max-w-xl p-6">
          <h2 className="text-2xl font-bold">Results by topic</h2>
          <div className="mt-4 space-y-2">
            {entries.map(([id, [r, t]]) => {
              const tp = topicById(id)!
              const pct = r / t
              return (
                <Link key={id} to={`/topic/${id}`} className="flex items-center gap-3 rounded-2xl bg-cream px-3 py-2.5 hover:bg-violet-soft">
                  <span className="text-xl">{tp.emoji}</span>
                  <span className="flex-1 font-medium">{tp.title}</span>
                  <span className={`font-semibold ${pct >= 0.8 ? 'text-mint-deep' : pct >= 0.5 ? 'text-sun-deep' : 'text-coral-deep'}`}>
                    {r}/{t}
                  </span>
                </Link>
              )
            })}
          </div>
          {entries[0] && entries[0][1][0] / entries[0][1][1] < 0.8 && (
            <div className="mt-4 rounded-2xl bg-violet-soft p-4 font-medium">
              🎯 Focus next on <b>{topicById(entries[0][0])!.title}</b> — rewatch the animation, then practise.
            </div>
          )}
        </Card>
    )
  }

  return (
    <Page>
      <ProblemRunner
        count={cfg.count}
        mode={cfg.mode}
        title={cfg.title}
        timeLimit={cfg.time || undefined}
        make={(i) => {
          const t = order[i]
          const d = cfg.diff(t)
          return { p: pick(t.gens)(d), topic: t.id, diff: d }
        }}
        onFinish={(res) => {
          const byTopic = summarise(res)
          s.saveExam({ date: Date.now(), kind: cfg.title, score: res.filter((r) => r.ok).length, total: res.length, byTopic })
          s.addXp(cfg.mode === 'test' ? 25 : 10)
          if (kind === 'quick') s.completeTask('challenge')
          if (cfg.mode === 'test') setTimeout(() => setResult(byTopic), 50)
        }}
        onExit={() => nav('/tests')}
        doneLabel="Back to tests"
      />
      {breakdown}
    </Page>
  )
}

export function Planner() {
  const { assessments, setAssessments, profile } = useStore()
  const [form, setForm] = useState<Omit<Assessment, 'id'>>({ title: '', date: todayKey(), kind: 'Topic test', topics: [] })
  const sorted = [...assessments].sort((a, b) => a.date.localeCompare(b.date))
  const mine = TOPICS.filter((t) => t.level <= profile.level)
  return (
    <Page>
      <PageHeader title="Term planner" subtitle="Add your science tests — the daily plan will focus on their topics first" emoji="🗓️" back="/tests" />
      <div className="grid gap-5 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-3">
          {sorted.length === 0 && <Card className="p-6 text-center text-ink-soft">No tests yet. Add your next science test →</Card>}
          {sorted.map((a) => {
            const d = daysUntil(a.date)
            return (
              <Card key={a.id} className={`p-4 ${d < 0 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-center ${d < 0 ? 'bg-black/5' : d <= 7 ? 'bg-coral text-white' : 'bg-violet-soft text-violet-deep'}`}>
                    <div>
                      <div className="font-display text-2xl font-bold leading-none">{d < 0 ? '✓' : d}</div>
                      <div className="text-[10px] font-semibold">{d < 0 ? 'done' : d === 1 ? 'day' : 'days'}</div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-sm text-ink-soft">
                      {a.kind} · {new Date(a.date + 'T00:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <button onClick={() => setAssessments(assessments.filter((x) => x.id !== a.id))} className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-coral-soft hover:text-coral" aria-label="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
                {a.topics.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {a.topics.map((id) => (
                      <Link key={id} to={`/topic/${id}`} className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold hover:bg-violet-soft">
                        {topicById(id)?.emoji} {topicById(id)?.title}
                      </Link>
                    ))}
                    {d >= 0 && (
                      <Link to={`/test/topics?ids=${a.topics.join(',')}`} className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-white">
                        Practice test →
                      </Link>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
        <Card className="p-5 lg:sticky lg:top-5 lg:self-start">
          <div className="font-semibold">Add a test</div>
          <div className="mt-3 space-y-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Term 4 Algebra test" className="w-full rounded-xl border-2 border-line px-3 py-2.5 font-medium outline-none focus:border-violet" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border-2 border-line px-3 py-2.5 font-medium outline-none focus:border-violet" />
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className="w-full rounded-xl border-2 border-line bg-white px-3 py-2.5 font-medium outline-none focus:border-violet">
              {['Topic test', 'Exam', 'Assignment / SAC', 'Quiz'].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
            <div className="text-sm font-semibold text-ink-soft">Topics on the test</div>
            <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto">
              {mine.map((t) => {
                const on = form.topics.includes(t.id)
                return (
                  <button key={t.id} onClick={() => setForm({ ...form, topics: on ? form.topics.filter((x) => x !== t.id) : [...form.topics, t.id] })} className={`rounded-full border-2 px-2.5 py-1 text-xs font-semibold ${on ? 'border-violet bg-violet text-white' : 'border-line'}`}>
                    {t.emoji} {t.title}
                  </button>
                )
              })}
            </div>
            <Button
              className="w-full"
              disabled={!form.title.trim()}
              onClick={() => {
                setAssessments([...assessments, { ...form, id: String(Date.now()) }])
                setForm({ title: '', date: todayKey(), kind: 'Topic test', topics: [] })
              }}
            >
              <Plus size={18} /> Add
            </Button>
          </div>
        </Card>
      </div>
    </Page>
  )
}
