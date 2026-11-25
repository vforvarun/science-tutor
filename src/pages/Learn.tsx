import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Dumbbell, Lightbulb, AlertTriangle, Printer, ListOrdered, Check, Sigma, Trophy } from 'lucide-react'
import { TOPICS, STRANDS, topicById, type Strand } from '../data/topics'
import { SCENES } from '../scenes'
import { useStore, topicState, masteryLabel, masteryColor } from '../lib/store'
import { pick } from '../lib/num'
import { Page, PageHeader, Card, Button, Ring, LevelPill, Progress } from '../components/ui'
import { MathText, TeX } from '../components/MathText'
import { ScenePlayer } from '../components/ScenePlayer'
import { ProblemRunner } from '../components/ProblemRunner'

export function TopicsPage() {
  const s = useStore()
  const [filter, setFilter] = useState<0 | 9 | 10>(0)
  const strands = Object.keys(STRANDS) as Strand[]
  return (
    <Page>
      <PageHeader
        title="Learn"
        subtitle="Watch, read, then practise. Tap any topic to start."
        emoji="📚"
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
      {strands.map((st) => {
        const list = TOPICS.filter((t) => t.strand === st && (!filter || t.level === filter))
        if (!list.length) return null
        return (
          <section key={st} className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
              <span className={`hue-${st} grid h-9 w-9 place-items-center rounded-xl text-lg`}>{STRANDS[st].emoji}</span>
              {STRANDS[st].name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t, k) => {
                const ts = topicState(s, t.id)
                return (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.03 }}>
                    <Link to={`/topic/${t.id}`} className={`card lift flex items-center gap-3 p-4 ${t.level > s.profile.level ? 'opacity-75' : ''}`}>
                      <div className={`hue-${t.strand} grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl shadow-sm`}>{t.emoji}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold leading-tight">{t.title}</div>
                        <div className="mt-0.5 line-clamp-1 text-xs text-ink-soft">{t.summary}</div>
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] font-semibold">
                          <span className={t.level === 9 ? 'text-sky' : 'text-violet'}>Yr {t.level}</span>
                          {ts.watched && <span className="text-mint-deep">🎬 watched</span>}
                        </div>
                      </div>
                      <Ring value={ts.mastery / 100} size={46} stroke={5} color={masteryColor(ts.mastery)}>
                        <span className="text-[11px] font-bold">{ts.attempts ? Math.round(ts.mastery) : '–'}</span>
                      </Ring>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )
      })}
    </Page>
  )
}

function LessonBody({ text }: { text: string }) {
  const lines = text.split('\n')
  const out: ReactNode[] = []
  let k = 0
  while (k < lines.length) {
    const line = lines[k]
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (k < lines.length && lines[k].startsWith('- ')) items.push(lines[k++].slice(2))
      out.push(
        <ul key={k} className="my-3 space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
              <span>
                <MathText text={it} />
              </span>
            </li>
          ))}
        </ul>,
      )
      continue
    }
    if (line.startsWith('> ')) {
      out.push(
        <div key={k} className="my-3 flex gap-3 rounded-2xl bg-sun-soft p-4">
          <Lightbulb className="shrink-0 text-sun-deep" size={20} />
          <div className="font-medium text-[#6b4a00]">
            <MathText text={line.slice(2)} />
          </div>
        </div>,
      )
    } else if (line.startsWith('! ')) {
      out.push(
        <div key={k} className="my-3 flex gap-3 rounded-2xl bg-coral-soft p-4">
          <AlertTriangle className="shrink-0 text-coral-deep" size={20} />
          <div className="font-medium text-[#8a2b2b]">
            <MathText text={line.slice(2)} />
          </div>
        </div>,
      )
    } else if (line.trim()) {
      out.push(
        <p key={k}>
          <MathText text={line} />
        </p>,
      )
    }
    k++
  }
  return <div className="prose-lesson text-[1.04rem]">{out}</div>
}

function WorkedExample({ q, steps, n }: { q: string; steps: string[]; n: number }) {
  const [shown, setShown] = useState(0)
  return (
    <Card className="p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-violet">Worked example {n}</div>
      <div className="mt-1 text-lg font-medium">
        <MathText text={q} />
      </div>
      <ol className="mt-3 space-y-2">
        {steps.slice(0, shown).map((s, i) => (
          <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet text-xs font-semibold text-white">{i + 1}</span>
            <span className="font-medium">
              <MathText text={s} />
            </span>
          </motion.li>
        ))}
      </ol>
      {shown < steps.length ? (
        <button onClick={() => setShown(shown + 1)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-violet-soft px-3 py-2 text-sm font-semibold text-violet-deep">
          <ListOrdered size={16} /> {shown === 0 ? 'Try it yourself first, then reveal step 1' : 'Next step'}
        </button>
      ) : (
        <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-mint-deep">
          <Check size={16} /> Done
        </div>
      )}
    </Card>
  )
}

export function TopicPage() {
  const { id } = useParams()
  const t = topicById(id!)
  const s = useStore()
  if (!t) return null
  const ts = topicState(s, t.id)
  const scene = SCENES[t.scene]
  const idx = TOPICS.indexOf(t)
  const nextT = TOPICS[idx + 1]

  return (
    <Page>
      <div className={`hue-${t.strand} relative mb-6 overflow-hidden rounded-[2rem] p-6 text-white shadow-[var(--shadow-lift)]`}>
        <div className="pointer-events-none absolute -right-6 -top-8 text-[9rem] opacity-20">{t.emoji}</div>
        <Link to="/topics" className="no-print text-sm font-semibold text-white/80 hover:text-white">
          ← All topics
        </Link>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{t.title}</h1>
        <p className="mt-1 max-w-xl font-medium text-white/90">{t.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold">
          <span className="rounded-full bg-white/20 px-3 py-1">Year {t.level}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">{STRANDS[t.strand].name}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">
            {masteryLabel(ts.mastery)} · {Math.round(ts.mastery)}%
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          {scene && (
            <section>
              <h2 className="mb-3 text-xl font-bold">🎬 Watch the animation</h2>
              <ScenePlayer
                scene={scene}
                onComplete={() => {
                  if (!ts.watched) {
                    s.markWatched(t.id)
                    s.addXp(10)
                    s.completeTask('learn')
                  }
                }}
              />
            </section>
          )}

          <Card className="overflow-hidden">
            <div className="flex gap-4 bg-gradient-to-r from-sun-soft to-[#fff8e6] p-5">
              <div className="text-5xl">{t.analogy.emoji}</div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-sun-deep">Think of it like…</div>
                <div className="font-display text-xl font-bold">{t.analogy.title}</div>
                <p className="mt-1 font-medium leading-relaxed">
                  <MathText text={t.analogy.text} />
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-7">
            <h2 className="mb-2 text-xl font-bold">📖 The lesson</h2>
            <LessonBody text={t.lesson} />
          </Card>

          <Card className="p-5 sm:p-7">
            <h2 className="mb-3 text-xl font-bold">🔑 Key terms</h2>
            <dl className="grid gap-2 sm:grid-cols-2">
              {t.terms.map(([term, def]) => (
                <div key={term} className="rounded-2xl bg-violet-soft/50 px-4 py-3">
                  <dt className="font-semibold text-violet-deep">{term}</dt>
                  <dd className="text-sm font-medium text-ink-soft">{def}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">✍️ Worked examples</h2>
            {t.examples.map((e, i) => (
              <WorkedExample key={i} q={e.q} steps={e.steps} n={i + 1} />
            ))}
          </section>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <AlertTriangle className="text-coral" /> Common mistakes
            </h2>
            <ul className="mt-3 space-y-2">
              {t.mistakes.map((m) => (
                <li key={m} className="flex gap-2 font-medium">
                  <span className="text-coral">✗</span>
                  <MathText text={m} />
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="no-print space-y-4 lg:sticky lg:top-5 lg:self-start">
          <Card className="p-5 text-center">
            <Ring value={ts.mastery / 100} size={110} color={masteryColor(ts.mastery)}>
              <div>
                <div className="font-display text-3xl font-bold">{Math.round(ts.mastery)}%</div>
                <div className="text-[10px] font-semibold text-ink-soft">mastery</div>
              </div>
            </Ring>
            <div className="mt-2 text-sm font-medium text-ink-soft">Level {ts.diff} of 3 · {ts.right}/{ts.attempts} correct</div>
            <Link to={`/master/${t.id}`} className="mt-4 block">
              <Button className="w-full">
                <Trophy size={18} /> Master it · {s.smart[t.id]?.score ?? 0}/100
              </Button>
            </Link>
            <Link to={`/practice/${t.id}`} className="mt-3 block">
              <Button variant="secondary" className="w-full">
                <Dumbbell size={18} /> Quick practice (8)
              </Button>
            </Link>
            <Button variant="secondary" className="mt-3 w-full" onClick={() => window.print()}>
              <Printer size={18} /> Print notes
            </Button>
          </Card>
          {t.formulas.length > 0 && (
            <Card className="p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Sigma size={18} className="text-violet" /> Key formulas
              </div>
              <div className="space-y-2">
                {t.formulas.map((f) => (
                  <div key={f} className="overflow-x-auto rounded-xl bg-violet-soft/60 px-3 py-2 text-center">
                    <TeX tex={f} />
                  </div>
                ))}
              </div>
            </Card>
          )}
          {nextT && (
            <Link to={`/topic/${nextT.id}`} className="card lift block p-4">
              <div className="text-xs font-semibold uppercase text-ink-soft">Next topic</div>
              <div className="font-semibold">
                {nextT.emoji} {nextT.title} <LevelPill level={nextT.level} />
              </div>
            </Link>
          )}
        </aside>
      </div>
    </Page>
  )
}

export function PracticePage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const nav = useNavigate()
  const t = topicById(id!)
  const s = useStore()
  const [wasDue] = useState(() => {
    const st = useStore.getState().topics[id!]
    return !!st && st.due > 0 && st.due <= Date.now()
  })
  if (!t) return null
  const count = Number(params.get('n') ?? 8)
  return (
    <Page>
      <div className="mb-4 text-center">
        <div className="text-sm font-semibold uppercase tracking-wider text-violet">
          {t.emoji} {t.title}
        </div>
        <div className="mx-auto mt-2 max-w-xs">
          <Progress value={topicState(useStore.getState(), t.id).mastery / 100} color="bg-gradient-to-r from-violet to-mint" className="h-2" />
        </div>
      </div>
      <ProblemRunner
        count={count}
        title="Practice"
        make={() => {
          const st = topicState(useStore.getState(), t.id)
          return { p: pick(t.gens)(st.diff), topic: t.id, diff: st.diff }
        }}
        onFinish={() => {
          s.finishPractice(t.id)
          s.completeTask('practise')
          if (wasDue) s.completeTask('review')
          s.addXp(5)
        }}
        onExit={() => nav(`/topic/${t.id}`)}
        doneLabel="Back to topic"
      />
    </Page>
  )
}
