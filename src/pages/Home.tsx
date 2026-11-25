import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Check, ChevronRight, Flame, CalendarClock, Clock, PlayCircle } from 'lucide-react'
import { useStore, streak, levelFromXp, todayKey, daysUntil, topicState } from '../lib/store'
import { dailyPlan } from '../lib/plan'
import { TOPICS } from '../data/topics'
import { Page, Ring, Progress, Card } from '../components/ui'
import { MathText } from '../components/MathText'

const TIPS = [
  'Use the key terms! Science tests reward the exact word — “photosynthesis”, not “how plants make food”.',
  'For “explain” questions, use the chain: what happens → because → so. Each link is usually a mark.',
  'Always write units: m/s, N, J, °C. A number without a unit can lose you the mark.',
  'Mistakes are how your brain learns. Read the explanation, then try a similar question straight away.',
  'Draw it! A quick diagram of a circuit, food web or cell makes most questions easier.',
  'In practical questions, name the independent, dependent and controlled variables.',
  'Estimate first: if a car’s speed comes out as 3000 m/s, something went wrong.',
]

export function Home() {
  const s = useStore()
  const today = s.days[todayKey()]
  const xpToday = today?.xp ?? 0
  const done = today?.tasks ?? []
  const plan = dailyPlan()
  const st = streak(s.days)
  const lvl = levelFromXp(s.xp)
  const mastered = TOPICS.filter((t) => topicState(s, t.id).mastery >= 80).length
  const mine = TOPICS.filter((t) => t.level <= s.profile.level)
  const watched = mine.filter((t) => topicState(s, t.id).watched).length
  const upcoming = [...s.assessments].filter((a) => daysUntil(a.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0]
  const dayNum = Math.floor(Date.now() / 86400000)
  const tip = TIPS[dayNum % TIPS.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const allDone = plan.every((t) => done.includes(t.id))
  const continueTopic = [...TOPICS].filter((t) => topicState(s, t.id).last > 0).sort((a, b) => topicState(s, b.id).last - topicState(s, a.id).last)[0]

  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0fa37f] via-[#1f8fb8] to-violet p-6 text-white shadow-[var(--shadow-lift)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        <div className="pointer-events-none absolute -right-6 -top-10 font-display text-[11rem] font-bold leading-none text-white/10">π</div>
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white/75">{new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              {greeting}
              {s.profile.name ? `, ${s.profile.name}` : ''}! 👋
            </h1>
            <p className="mt-2 max-w-md font-medium text-white/85">{allDone ? 'Plan complete — amazing work! Every day you practise, science makes more sense.' : 'Here’s your plan for today. Small steps, every day.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
                <Flame size={16} className="text-sun" /> {st} day streak
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">⭐ Level {lvl.level}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">🏆 {mastered} mastered</span>
            </div>
            <div className="mt-4 max-w-xs">
              <div className="mb-1 text-xs font-medium text-white/70">
                Level {lvl.level} → {lvl.level + 1}: {lvl.into} / {lvl.span} XP
              </div>
              <Progress value={lvl.into / lvl.span} color="bg-sun" className="bg-white/20" />
            </div>
          </div>
          <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
            <Ring value={xpToday / s.profile.dailyGoal} size={120} stroke={12} color="#ffbe0b">
              <div>
                <div className="font-display text-3xl font-bold">{xpToday}</div>
                <div className="text-[11px] font-medium text-white/75">/ {s.profile.dailyGoal} XP</div>
              </div>
            </Ring>
            <div className="mt-1 text-center text-xs font-semibold text-white/80">Daily goal</div>
          </div>
        </div>
      </motion.div>

      {upcoming && (
        <Link to="/planner" className="lift mt-4 flex items-center gap-3 rounded-2xl bg-coral-soft px-4 py-3 font-semibold text-coral-deep">
          <CalendarClock size={20} />
          <span className="flex-1">
            {upcoming.title} — {daysUntil(upcoming.date) === 0 ? 'today!' : `in ${daysUntil(upcoming.date)} day${daysUntil(upcoming.date) > 1 ? 's' : ''}`}
          </span>
          <ChevronRight size={18} />
        </Link>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">Today’s plan</h2>
            <span className="text-sm font-medium text-ink-soft">
              {plan.filter((t) => done.includes(t.id)).length}/{plan.length} done · ~{plan.reduce((a, t) => a + t.minutes, 0)} min
            </span>
          </div>
          <div className="space-y-3">
            {plan.map((t, k) => {
              const isDone = done.includes(t.id)
              return (
                <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * k }}>
                  <Link to={t.to} className={`card lift flex items-center gap-4 p-3.5 ${isDone ? 'opacity-70' : ''}`}>
                    <div className={`hue-${t.hue} grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl shadow-sm`}>{t.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-semibold leading-tight ${isDone ? 'line-through decoration-2' : ''}`}>{t.title}</div>
                      <div className="truncate text-sm text-ink-soft">{t.subtitle}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-ink-soft">
                      <Clock size={13} /> {t.minutes}m
                    </div>
                    <div className={`grid h-9 w-9 place-items-center rounded-full ${isDone ? 'bg-mint text-white' : 'border-2 border-line text-transparent'}`}>
                      <Check size={18} strokeWidth={3} />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section className="space-y-4">
          {continueTopic && (
            <Link to={`/topic/${continueTopic.id}`} className="card lift block overflow-hidden">
              <div className={`hue-${continueTopic.strand} flex items-center gap-3 px-5 py-4 text-white`}>
                <span className="text-3xl">{continueTopic.emoji}</span>
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/80">Continue</div>
                  <div className="font-display text-xl font-bold">{continueTopic.title}</div>
                </div>
                <PlayCircle size={30} />
              </div>
              <div className="p-4">
                <div className="mb-1 flex justify-between text-sm font-medium">
                  <span>Mastery</span>
                  <span>{Math.round(topicState(s, continueTopic.id).mastery)}%</span>
                </div>
                <Progress value={topicState(s, continueTopic.id).mastery / 100} color="bg-gradient-to-r from-violet to-mint" />
              </div>
            </Link>
          )}
          <Card className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-violet">Your journey</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { n: `${watched}/${mine.length}`, l: 'lessons watched', c: 'text-violet', bg: 'bg-violet-soft' },
                { n: mastered, l: 'topics mastered', c: 'text-mint-deep', bg: 'bg-mint-soft' },
                { n: s.warmupBest, l: 'best quick-fire', c: 'text-sun-deep', bg: 'bg-sun-soft' },
              ].map((x) => (
                <div key={x.l} className={`rounded-2xl ${x.bg} p-3`}>
                  <div className={`font-display text-2xl font-bold ${x.c}`}>{x.n}</div>
                  <div className="text-[11px] font-medium text-ink-soft">{x.l}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-mint-deep">💡 Tip of the day</div>
            <p className="mt-2 font-medium leading-relaxed">
              <MathText text={tip} />
            </p>
          </Card>
        </section>
      </div>
    </Page>
  )
}
