// Topics for Victorian Curriculum Science, Levels 9–10.
// `lesson` markup: blank line = paragraph · "- " bullet · "> " tip · "! " common-mistake callout · $maths$ / $\ce{chem}$
import { termsGen, type Gen } from '../lib/problem'
import { BIOLOGY } from './biology'
import { CHEMISTRY } from './chemistry'
import { PHYSICS } from './physics'
import { EARTH } from './earth'

export type Strand = 'biology' | 'chemistry' | 'physics' | 'earth' | 'skills'

export const STRANDS: Record<Strand, { name: string; emoji: string }> = {
  biology: { name: 'Biology', emoji: '🧬' },
  chemistry: { name: 'Chemistry', emoji: '⚗️' },
  physics: { name: 'Physics', emoji: '⚡' },
  earth: { name: 'Earth & space', emoji: '🌏' },
  skills: { name: 'Science skills', emoji: '🔬' },
}

export interface TopicDef {
  id: string
  title: string
  strand: Strand
  level: 9 | 10
  emoji: string
  summary: string
  analogy: { emoji: string; title: string; text: string }
  lesson: string
  examples: { q: string; steps: string[] }[]
  mistakes: string[]
  formulas: string[]
  /** glossary: [term, meaning] — also used for key-term practice */
  terms: [string, string][]
  /** [skill name, generator] — the practice question types */
  practice: [string, Gen][]
  scene: string
}

export interface Topic extends Omit<TopicDef, 'practice'> {
  gens: Gen[]
  skills: string[]
}

/** Every topic also practises its key terms. */
const build = (t: TopicDef): Topic => {
  const { practice, ...rest } = t
  return { ...rest, lesson: t.lesson.trim(), gens: [...practice.map(([, g]) => g), termsGen(t.terms)], skills: [...practice.map(([n]) => n), 'Key terms'] }
}

export const TOPICS: Topic[] = [...BIOLOGY, ...CHEMISTRY, ...PHYSICS, ...EARTH].map(build)

export const topicById = (id: string) => TOPICS.find((t) => t.id === id)
