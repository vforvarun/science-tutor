import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Level } from './problem'

const DAY = 86400000
export const REVIEW_DAYS = [2, 5, 10, 21, 45]

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export function daysUntil(date: string) {
  return Math.round((new Date(date + 'T00:00:00').getTime() - new Date(todayKey() + 'T00:00:00').getTime()) / DAY)
}

export interface TopicState {
  mastery: number // 0..100
  attempts: number
  right: number
  run: number // +ve = streak of right answers, -ve = streak of wrong
  diff: Level
  last: number
  due: number // next spaced review (0 = not scheduled)
  reviews: number
  watched: boolean
  read: boolean
}
export interface DayLog {
  xp: number
  minutes: number
  tasks: string[]
  answers: number
}
export interface ExamResult {
  date: number
  kind: string
  score: number
  total: number
  byTopic: Record<string, [number, number]>
}
export interface Assessment {
  id: string
  title: string
  date: string
  kind: string
  topics: string[]
}
export interface Profile {
  name: string
  level: 9 | 10
  placed: boolean
  dailyGoal: number
  voiceURI?: string
  /** lesson narration: pre-recorded natural voice (default) or the device's own voice */
  narration?: 'recorded' | 'device'
  rate: number
  pin?: string
  sound: boolean
}

const newTopic = (): TopicState => ({ mastery: 0, attempts: 0, right: 0, run: 0, diff: 1, last: 0, due: 0, reviews: 0, watched: false, read: false })

export interface SmartState {
  score: number // current SmartScore 0..100
  best: number
  answered: number
  right: number
  seconds: number // total time spent in mastery mode
  perfectAt?: number // when 100 was first reached
}

interface State {
  profile: Profile
  topics: Record<string, TopicState>
  smart: Record<string, SmartState>
  days: Record<string, DayLog>
  exams: ExamResult[]
  warmupBest: number
  assessments: Assessment[]
  badges: Record<string, number>
  xp: number
  lastBadge?: string

  setProfile: (p: Partial<Profile>) => void
  addXp: (n: number) => void
  answer: (topic: string, ok: boolean, diff: Level) => void
  finishPractice: (topic: string) => void
  smartAnswer: (topic: string, score: number, ok: boolean, seconds: number) => void
  markWatched: (topic: string) => void
  markRead: (topic: string) => void
  completeTask: (id: string) => void
  saveExam: (e: ExamResult) => void
  saveWarmup: (score: number) => void
  setAssessments: (a: Assessment[]) => void
  addMinute: () => void
  clearBadge: () => void
  importAll: (json: string) => boolean
  resetAll: () => void
}

const initial = {
  profile: { name: '', level: 9 as const, placed: false, dailyGoal: 60, rate: 1, sound: true },
  topics: {},
  smart: {},
  days: {},
  exams: [],
  warmupBest: 0,
  assessments: [],
  badges: {},
  xp: 0,
}

function touchDay(days: Record<string, DayLog>, f: (d: DayLog) => DayLog) {
  const k = todayKey()
  return { ...days, [k]: f({ ...(days[k] ?? { xp: 0, minutes: 0, tasks: [], answers: 0 }) }) }
}
function startOfDay() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      ...initial,
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      addXp: (n) => {
        set((s) => ({ xp: s.xp + n, days: touchDay(s.days, (d) => ({ ...d, xp: d.xp + n })) }))
        checkBadges()
      },
      answer: (topic, ok, diff) =>
        set((s) => {
          const t = { ...(s.topics[topic] ?? newTopic()) }
          const weight = [0, 0.55, 0.8, 1][diff]
          t.mastery = ok ? Math.min(100, t.mastery + (100 - t.mastery) * 0.22 * weight + 2) : Math.max(0, t.mastery - Math.max(4, t.mastery * 0.12))
          t.attempts++
          if (ok) t.right++
          t.run = ok ? Math.max(1, t.run + 1) : Math.min(-1, t.run - 1)
          // adaptive difficulty
          if (t.run >= 3 && t.diff < 3) {
            t.diff = (t.diff + 1) as Level
            t.run = 0
          } else if (t.run <= -2 && t.diff > 1) {
            t.diff = (t.diff - 1) as Level
            t.run = 0
          }
          t.last = Date.now()
          return { topics: { ...s.topics, [topic]: t }, days: touchDay(s.days, (d) => ({ ...d, answers: d.answers + 1 })) }
        }),
      finishPractice: (topic) => {
        set((s) => {
          const t = { ...(s.topics[topic] ?? newTopic()) }
          if (t.mastery >= 75) {
            t.due = startOfDay() + REVIEW_DAYS[Math.min(t.reviews, REVIEW_DAYS.length - 1)] * DAY
            t.reviews++
          } else t.due = startOfDay() + DAY
          return { topics: { ...s.topics, [topic]: t } }
        })
        checkBadges()
      },
      smartAnswer: (topic, score, ok, seconds) => {
        set((s) => {
          const cur = s.smart[topic] ?? { score: 0, best: 0, answered: 0, right: 0, seconds: 0 }
          const next: SmartState = {
            score,
            best: Math.max(cur.best, score),
            answered: cur.answered + 1,
            right: cur.right + (ok ? 1 : 0),
            seconds: cur.seconds + seconds,
            perfectAt: cur.perfectAt ?? (score >= 100 ? Date.now() : undefined),
          }
          return { smart: { ...s.smart, [topic]: next } }
        })
        checkBadges()
      },
      markWatched: (topic) => {
        set((s) => ({ topics: { ...s.topics, [topic]: { ...(s.topics[topic] ?? newTopic()), watched: true } } }))
        checkBadges()
      },
      markRead: (topic) => set((s) => ({ topics: { ...s.topics, [topic]: { ...(s.topics[topic] ?? newTopic()), read: true } } })),
      completeTask: (id) => set((s) => ({ days: touchDay(s.days, (d) => (d.tasks.includes(id) ? d : { ...d, tasks: [...d.tasks, id] })) })),
      saveExam: (e) => {
        set((s) => ({ exams: [...s.exams, e] }))
        checkBadges()
      },
      saveWarmup: (score) => set((s) => ({ warmupBest: Math.max(s.warmupBest, score) })),
      setAssessments: (a) => set({ assessments: a }),
      addMinute: () => set((s) => ({ days: touchDay(s.days, (d) => ({ ...d, minutes: d.minutes + 1 })) })),
      clearBadge: () => set({ lastBadge: undefined }),
      importAll: (json) => {
        try {
          const data = JSON.parse(json)
          const st = data.state ?? data
          if (!st.profile || !st.topics) return false
          set({ ...initial, ...st, smart: st.smart ?? {} })
          return true
        } catch {
          return false
        }
      },
      resetAll: () => set({ ...initial }),
    }),
    {
      name: 'spark-science-v1',
      version: 1,
      // the "new badge" toast is momentary — don't replay it after a reload
      partialize: (s) => ({ ...s, lastBadge: undefined }),
      // older saves (before mastery mode) have no `smart` field
      merge: (persisted, current) => ({ ...current, ...(persisted as object), smart: (persisted as { smart?: Record<string, SmartState> })?.smart ?? {} }),
    },
  ),
)

export const topicState = (s: { topics: Record<string, TopicState> }, id: string) => s.topics[id] ?? newTopic()

export function streak(days: Record<string, DayLog>) {
  let n = 0
  const d = new Date()
  if (!(days[todayKey(d)]?.xp > 0)) d.setDate(d.getDate() - 1)
  while (days[todayKey(d)]?.xp > 0) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function levelFromXp(xp: number) {
  let lvl = 1
  while (xp >= (100 * lvl * (lvl + 1)) / 2) lvl++
  const prev = (100 * (lvl - 1) * lvl) / 2
  const next = (100 * lvl * (lvl + 1)) / 2
  return { level: lvl, into: xp - prev, span: next - prev }
}

export const masteryLabel = (m: number) => (m >= 80 ? 'Mastered' : m >= 50 ? 'Getting there' : m > 0 ? 'Learning' : 'Not started')
export const masteryColor = (m: number) => (m >= 80 ? '#2ec4b6' : m >= 50 ? '#ffbe0b' : m > 0 ? '#6246ea' : '#d6d2e8')

export const BADGES: { id: string; emoji: string; title: string; desc: string }[] = [
  { id: 'first', emoji: '🌱', title: 'First steps', desc: 'Earn your first XP' },
  { id: 'watch1', emoji: '🎬', title: 'Movie time', desc: 'Watch an animated lesson' },
  { id: 'watch10', emoji: '🍿', title: 'Binge watcher', desc: 'Watch 10 animated lessons' },
  { id: 'master1', emoji: '⭐', title: 'Got it!', desc: 'Master a topic (80%+)' },
  { id: 'master5', emoji: '🌟', title: 'Rising star', desc: 'Master 5 topics' },
  { id: 'master12', emoji: '🏆', title: 'Science champion', desc: 'Master 12 topics' },
  { id: 'streak3', emoji: '🔥', title: 'On fire', desc: '3-day streak' },
  { id: 'streak7', emoji: '🗓️', title: 'Week warrior', desc: '7-day streak' },
  { id: 'streak30', emoji: '👑', title: 'Unstoppable', desc: '30-day streak' },
  { id: 'hard', emoji: '💪', title: 'Level 3', desc: 'Reach the hardest level in a topic' },
  { id: 'exam1', emoji: '📝', title: 'Test ready', desc: 'Complete a practice test' },
  { id: 'exam90', emoji: '🎯', title: 'Sharp shooter', desc: 'Score 90%+ on a test' },
  { id: 'xp1000', emoji: '💎', title: '1000 XP', desc: 'Earn 1000 XP' },
  { id: 'challenge', emoji: '🔥', title: 'Challenge accepted', desc: 'Reach the Challenge Zone (SmartScore 90)' },
  { id: 'perfect1', emoji: '💯', title: 'Perfect!', desc: 'Reach a SmartScore of 100' },
  { id: 'perfect5', emoji: '🥇', title: 'Perfectionist', desc: 'SmartScore 100 in 5 topics' },
  { id: 'q500', emoji: '🏋️', title: 'Hard worker', desc: 'Answer 500 mastery questions' },
]

function checkBadges() {
  const s = useStore.getState()
  const ts = Object.values(s.topics)
  const mastered = ts.filter((t) => t.mastery >= 80).length
  const watched = ts.filter((t) => t.watched).length
  const st = streak(s.days)
  const earned: Record<string, boolean> = {
    first: s.xp > 0,
    watch1: watched >= 1,
    watch10: watched >= 10,
    master1: mastered >= 1,
    master5: mastered >= 5,
    master12: mastered >= 12,
    streak3: st >= 3,
    streak7: st >= 7,
    streak30: st >= 30,
    hard: ts.some((t) => t.diff === 3),
    exam1: s.exams.length > 0,
    exam90: s.exams.some((e) => e.total >= 10 && e.score / e.total >= 0.9),
    xp1000: s.xp >= 1000,
    challenge: Object.values(s.smart).some((x) => x.best >= 90),
    perfect1: Object.values(s.smart).some((x) => x.best >= 100),
    perfect5: Object.values(s.smart).filter((x) => x.best >= 100).length >= 5,
    q500: Object.values(s.smart).reduce((a, x) => a + x.answered, 0) >= 500,
  }
  const add: Record<string, number> = {}
  let last: string | undefined
  for (const [id, ok] of Object.entries(earned)) {
    if (ok && !s.badges[id]) {
      add[id] = Date.now()
      last = id
    }
  }
  if (last) useStore.setState({ badges: { ...s.badges, ...add }, lastBadge: last })
}
