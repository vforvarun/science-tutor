import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Copy, Check } from 'lucide-react'
import { useStore, streak, levelFromXp, BADGES, todayKey, daysUntil, topicState, masteryColor } from '../lib/store'
import { TOPICS, STRANDS, type Strand } from '../data/topics'
import { Page, PageHeader, Card, Button, Progress } from '../components/ui'

function lastDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d
  })
}

function Bars({ data, color = '#6246ea', unit }: { data: { label: string; value: number; today?: boolean }[]; color?: string; unit: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="flex h-40 items-end gap-1.5">
      {data.map((d, i) => (
        <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
          <div className="pointer-events-none absolute -top-1 z-10 hidden -translate-y-full whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs font-semibold text-white group-hover:block">
            {d.value} {unit}
          </div>
          <div className="w-full rounded-t-lg" style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 4 : 2, background: d.value ? color : 'rgb(0 0 0 / 0.07)' }} />
          <div className={`mt-1 text-[10px] font-semibold ${d.today ? 'text-ink' : 'text-ink-soft'}`}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

function strandMastery(s: ReturnType<typeof useStore.getState>, st: Strand) {
  const list = TOPICS.filter((t) => t.strand === st && t.level <= s.profile.level)
  if (!list.length) return null
  return list.reduce((a, t) => a + topicState(s, t.id).mastery, 0) / list.length
}

function weakTopics(s: ReturnType<typeof useStore.getState>) {
  return TOPICS.filter((t) => topicState(s, t.id).attempts >= 4 && topicState(s, t.id).mastery < 70).sort((a, b) => topicState(s, a.id).mastery - topicState(s, b.id).mastery)
}

export function ProgressPage() {
  const s = useStore()
  const lvl = levelFromXp(s.xp)
  const days = lastDays(14)
  const xpData = days.map((d) => ({ label: d.toLocaleDateString('en-AU', { weekday: 'narrow' }), value: s.days[todayKey(d)]?.xp ?? 0, today: todayKey(d) === todayKey() }))
  const week = lastDays(7).reduce((a, d) => a + (s.days[todayKey(d)]?.minutes ?? 0), 0)
  const mastered = TOPICS.filter((t) => topicState(s, t.id).mastery >= 80).length
  const weak = weakTopics(s)

  return (
    <Page>
      <PageHeader title="Progress" subtitle="Every question makes you stronger" emoji="📈" right={<Link to="/parent" className="rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-black/5">👪 Parent view</Link>} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { v: `Lv ${lvl.level}`, l: `${s.xp} XP total`, c: 'from-violet to-[#8a6dff]' },
          { v: `${streak(s.days)} 🔥`, l: 'day streak', c: 'from-[#ff9f43] to-coral' },
          { v: mastered, l: `of ${TOPICS.length} topics mastered`, c: 'from-mint to-mint-deep' },
          { v: `${week} min`, l: 'practised this week', c: 'from-sky to-[#2a5bd7]' },
        ].map((x) => (
          <div key={x.l} className={`rounded-3xl bg-gradient-to-br ${x.c} p-4 text-white shadow-md`}>
            <div className="font-display text-3xl font-bold">{x.v}</div>
            <div className="text-sm font-medium text-white/85">{x.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 font-semibold">XP — last 14 days</div>
          <Bars data={xpData} unit="XP" />
        </Card>
        <Card className="p-5">
          <div className="mb-3 font-semibold">Mastery by strand</div>
          <div className="space-y-3">
            {(Object.keys(STRANDS) as Strand[]).map((st) => {
              const m = strandMastery(s, st)
              if (m === null) return null
              return (
                <div key={st}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>
                      {STRANDS[st].emoji} {STRANDS[st].name}
                    </span>
                    <span className="text-ink-soft">{Math.round(m)}%</span>
                  </div>
                  <Progress value={m / 100} color={m >= 80 ? 'bg-mint' : m >= 50 ? 'bg-sun' : 'bg-violet'} className="mt-1 h-2.5" />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-5 p-5">
        <div className="mb-3 font-semibold">🗺️ Topic map</div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.filter((t) => t.level <= s.profile.level).map((t) => {
            const ts = topicState(s, t.id)
            return (
              <Link key={t.id} to={`/topic/${t.id}`} className="flex items-center gap-3 rounded-2xl bg-cream px-3 py-2 hover:bg-violet-soft">
                <span className="text-xl">{t.emoji}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.title}</span>
                <span className="h-3 w-16 overflow-hidden rounded-full bg-black/10">
                  <span className="block h-full rounded-full" style={{ width: `${ts.mastery}%`, background: masteryColor(ts.mastery) }} />
                </span>
              </Link>
            )
          })}
        </div>
      </Card>

      {weak.length > 0 && (
        <Card className="mt-5 p-5">
          <div className="mb-3 font-semibold">🎯 Focus areas</div>
          <div className="space-y-2">
            {weak.slice(0, 5).map((t) => (
              <Link key={t.id} to={`/practice/${t.id}`} className="flex items-center gap-3 rounded-2xl bg-cream px-3 py-2.5 hover:bg-violet-soft">
                <span>{t.emoji}</span>
                <span className="flex-1 font-medium">{t.title}</span>
                <span className="font-semibold text-coral-deep">{Math.round(topicState(s, t.id).mastery)}%</span>
                <span className="text-sm font-semibold text-violet">Practise →</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <h2 className="mt-8 mb-3 text-2xl font-bold">🏅 Badges</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {BADGES.map((b) => {
          const got = s.badges[b.id]
          return (
            <div key={b.id} className={`card p-3 text-center ${got ? '' : 'opacity-50 grayscale'}`}>
              <div className="text-4xl">{got ? b.emoji : '🔒'}</div>
              <div className="mt-1 text-sm font-semibold leading-tight">{b.title}</div>
              <div className="text-[11px] text-ink-soft">{b.desc}</div>
            </div>
          )
        })}
      </div>

      {s.exams.length > 0 && (
        <>
          <h2 className="mt-8 mb-3 text-2xl font-bold">📝 Test scores</h2>
          <Card className="p-5">
            <Bars data={s.exams.slice(-12).map((e) => ({ label: new Date(e.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'numeric' }), value: Math.round((e.score / e.total) * 100) }))} color="#2ec4b6" unit="%" />
          </Card>
        </>
      )}
    </Page>
  )
}

function weeklySummary() {
  const s = useStore.getState()
  const week = lastDays(7)
  const mins = week.reduce((a, d) => a + (s.days[todayKey(d)]?.minutes ?? 0), 0)
  const active = week.filter((d) => (s.days[todayKey(d)]?.xp ?? 0) > 0).length
  const mine = TOPICS.filter((t) => t.level <= s.profile.level)
  const mastered = mine.filter((t) => topicState(s, t.id).mastery >= 80).length
  const watched = mine.filter((t) => topicState(s, t.id).watched).length
  const weak = weakTopics(s)
  const last = s.exams[s.exams.length - 1]
  return [
    `Science progress — week ending ${new Date().toLocaleDateString('en-AU')}`,
    `• Practised on ${active} of the last 7 days (${mins} minutes). Current streak: ${streak(s.days)} days.`,
    `• Lessons watched: ${watched} of ${mine.length}. Topics mastered (80%+): ${mastered}.`,
    last ? `• Latest test: ${last.kind} — ${Math.round((last.score / last.total) * 100)}%.` : '• No tests taken yet.',
    `• Best quick-fire score: ${s.warmupBest}/10.`,
    weak.length ? `• Needs work: ${weak.slice(0, 4).map((t) => `${t.title} (${Math.round(topicState(s, t.id).mastery)}%)`).join(', ')}.` : '• No weak areas flagged yet.',
  ].join('\n')
}

export function ParentPage() {
  const s = useStore()
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [copied, setCopied] = useState(false)

  if (!unlocked) {
    const hasPin = !!s.profile.pin
    return (
      <Page>
        <PageHeader title="Parent dashboard" back="/progress" emoji="👪" />
        <Card className="mx-auto max-w-sm p-7 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-violet-soft text-violet">
            <Lock size={30} />
          </div>
          {hasPin ? (
            <>
              <div className="mt-4 font-semibold">Enter parent PIN</div>
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" type="password" className="mt-3 w-full rounded-2xl border-2 border-line px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-violet" />
              <Button className="mt-4 w-full" onClick={() => (pin === s.profile.pin ? setUnlocked(true) : setPin(''))}>
                Unlock
              </Button>
            </>
          ) : (
            <>
              <div className="mt-4 font-semibold">Create a parent PIN</div>
              <p className="text-sm text-ink-soft">4–6 digits. Keeps this page private.</p>
              <input value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" type="password" className="mt-3 w-full rounded-2xl border-2 border-line px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-violet" />
              <Button
                className="mt-4 w-full"
                disabled={newPin.length < 4}
                onClick={() => {
                  s.setProfile({ pin: newPin })
                  setUnlocked(true)
                }}
              >
                Set PIN & open
              </Button>
            </>
          )}
        </Card>
      </Page>
    )
  }

  const minData = lastDays(14).map((d) => ({ label: d.toLocaleDateString('en-AU', { weekday: 'narrow' }), value: s.days[todayKey(d)]?.minutes ?? 0, today: todayKey(d) === todayKey() }))
  const upcoming = [...s.assessments].filter((a) => daysUntil(a.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))
  const summary = weeklySummary()
  return (
    <Page>
      <PageHeader title="Parent dashboard" subtitle={s.profile.name ? `${s.profile.name}’s science at a glance` : 'Science at a glance'} back="/progress" emoji="👪" />
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold">This week</div>
          <Button
            variant="soft"
            className="px-3 py-2 text-sm"
            onClick={() => {
              navigator.clipboard?.writeText(summary)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy summary'}
          </Button>
        </div>
        <pre className="mt-3 whitespace-pre-wrap font-sans font-medium leading-relaxed text-ink">{summary}</pre>
      </Card>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 font-semibold">Minutes practised — last 14 days</div>
          <Bars data={minData} color="#2ec4b6" unit="min" />
        </Card>
        <Card className="p-5">
          <div className="mb-3 font-semibold">Topic mastery</div>
          <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
            {TOPICS.filter((t) => t.level <= s.profile.level).map((t) => {
              const ts = topicState(s, t.id)
              return (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <span className="flex-1">
                    {t.emoji} {t.title}
                  </span>
                  <span className="text-xs text-ink-soft">{ts.watched ? '🎬' : ''}</span>
                  <span className="w-20 text-right font-semibold" style={{ color: ts.attempts ? masteryColor(ts.mastery) : '#9a97b3' }}>
                    {ts.attempts ? `${Math.round(ts.mastery)}%` : 'not yet'}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 font-semibold">Upcoming tests</div>
          {upcoming.length === 0 ? (
            <div className="text-ink-soft">None entered. You can add them in the Term planner.</div>
          ) : (
            upcoming.map((a) => (
              <div key={a.id} className="flex justify-between border-b border-line py-2 last:border-0">
                <span>{a.title}</span>
                <span className="font-semibold">{daysUntil(a.date)} days</span>
              </div>
            ))
          )}
        </Card>
      </div>
    </Page>
  )
}
