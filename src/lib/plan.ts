import { TOPICS, type Topic } from '../data/topics'
import { useStore, topicState, daysUntil } from './store'

export interface PlanTask {
  id: 'warmup' | 'review' | 'learn' | 'practise' | 'challenge'
  title: string
  subtitle: string
  emoji: string
  to: string
  minutes: number
  hue: string
}

/** Topics in a sensible teaching order for the student's level; upcoming-test topics first. */
export function orderedTopics(): Topic[] {
  const s = useStore.getState()
  const level = s.profile.level
  const soon = [...s.assessments].filter((a) => daysUntil(a.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0]
  const focus = new Set(soon?.topics ?? [])
  const mine = TOPICS.filter((t) => t.level <= level)
  return [...mine.filter((t) => focus.has(t.id)), ...mine.filter((t) => !focus.has(t.id))]
}

export function dueReviews(): Topic[] {
  const s = useStore.getState()
  return TOPICS.filter((t) => {
    const st = s.topics[t.id]
    return st && st.due > 0 && st.due <= Date.now()
  })
}

export function dailyPlan(): PlanTask[] {
  const s = useStore.getState()
  const tasks: PlanTask[] = [{ id: 'warmup', title: 'Quick-fire key terms', subtitle: '10 quick questions to warm up', emoji: '⚡', to: '/warmup', minutes: 3, hue: 'warm' }]

  const due = dueReviews()
  if (due.length) tasks.push({ id: 'review', title: `Review: ${due[0].title}`, subtitle: `Keep it fresh — ${due.length} topic${due.length > 1 ? 's' : ''} due`, emoji: '🧠', to: `/practice/${due[0].id}`, minutes: 5, hue: 'skills' })

  const order = orderedTopics()
  const learn = order.find((t) => !topicState(s, t.id).watched)
  if (learn) tasks.push({ id: 'learn', title: `Learn: ${learn.title}`, subtitle: 'Watch the animated lesson', emoji: '🎬', to: `/topic/${learn.id}`, minutes: 6, hue: learn.strand })

  const inProgress = order.filter((t) => topicState(s, t.id).attempts > 0 && topicState(s, t.id).mastery < 80).sort((a, b) => topicState(s, a.id).mastery - topicState(s, b.id).mastery)[0]
  const pr = inProgress ?? learn ?? order[0]
  if (pr) tasks.push({ id: 'practise', title: `Master: ${pr.title}`, subtitle: `SmartScore ${s.smart[pr.id]?.score ?? 0}/100 — practise until perfect`, emoji: pr.emoji, to: `/master/${pr.id}`, minutes: 8, hue: pr.strand })

  tasks.push({ id: 'challenge', title: 'Mixed challenge', subtitle: '8 questions from your topics', emoji: '🎯', to: '/test/quick', minutes: 5, hue: 'chemistry' })
  return tasks
}
