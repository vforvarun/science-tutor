// Quick-fire starter: rapid key-term questions from every topic at the student's level.
import type { Problem } from '../lib/problem'
import { TOPICS } from '../data/topics'
import { pick } from '../lib/num'

export function warmupQuestion(level: 9 | 10 = 10): Problem {
  const t = pick(TOPICS.filter((x) => x.level <= level))
  const keyTerms = t.gens[t.gens.length - 1] // every topic's last generator practises its key terms
  const p = keyTerms(pick([1, 2] as const))
  return { ...p, q: `${t.emoji} ${t.title} — ${p.q}` }
}
