import { shuffle, pick } from './num'

export type Fig =
  /** line graph(s) in the first quadrant, e.g. distance–time or a decay curve */
  | { type: 'plot'; series: { pts: [number, number][]; color?: string; label?: string }[]; xLabel: string; yLabel: string; xMax: number; yMax: number; xStep?: number; yStep?: number; dots?: boolean }
  | { type: 'circuit'; kind: 'series' | 'parallel'; cell: string; resistors: string[]; ammeter?: boolean }
  | { type: 'punnett'; top: [string, string]; side: [string, string]; cells?: string[] }
  | { type: 'atom'; symbol: string; p: number; n: number; shells: number[] }
  | { type: 'wave'; wavelength?: string; amplitude?: string; cycles?: number }

export interface Problem {
  q: string
  kind: 'num' | 'mcq' | 'multi'
  ans?: number
  tol?: number
  unit?: string
  options?: string[] // first is correct (shuffled on display)
  fields?: { label: string; ans: number }[]
  unordered?: boolean
  steps: string[]
  hint?: string
  fig?: Fig
}

export type Level = 1 | 2 | 3
export type Gen = (d: Level) => Problem

/** Build MCQ options, removing duplicates of the correct answer. */
export function mcq(q: string, correct: string, wrong: string[], steps: string[], hint?: string, fig?: Fig): Problem {
  const uniq = [...new Set(wrong.filter((w) => w !== correct))]
  return { q, kind: 'mcq', options: [correct, ...shuffle(uniq).slice(0, 3)], steps, hint, fig }
}

export function num(q: string, ans: number, steps: string[], opts: { tol?: number; unit?: string; hint?: string; fig?: Fig } = {}): Problem {
  return { q, kind: 'num', ans, steps, tol: opts.tol, unit: opts.unit, hint: opts.hint, fig: opts.fig }
}

export function multi(q: string, fields: { label: string; ans: number }[], steps: string[], opts: { unordered?: boolean; tol?: number; hint?: string; fig?: Fig } = {}): Problem {
  return { q, kind: 'multi', fields, steps, unordered: opts.unordered, tol: opts.tol, hint: opts.hint, fig: opts.fig }
}

/** A concept question: correct answer `a`, wrong options `w`, explanation `why`, difficulty `d` (default 1). */
export interface BankQ {
  q: string
  a: string
  w: string[]
  why: string
  d?: Level
  hint?: string
  fig?: Fig
}

/** Turns a bank of concept questions into a generator that picks by difficulty. */
export function bank(items: BankQ[]): Gen {
  return (d) => {
    const fit = items.filter((x) => (x.d ?? 1) <= d)
    const exact = fit.filter((x) => (x.d ?? 1) === d)
    const x = exact.length && Math.random() < 0.6 ? pick(exact) : pick(fit.length ? fit : items)
    return mcq(x.q, x.a, x.w, [x.why], x.hint, x.fig)
  }
}

/** Key-term questions from a glossary: term → meaning, or meaning → term. */
export function termsGen(terms: [string, string][]): Gen {
  return (d) => {
    const [t, def] = pick(terms)
    const others = terms.filter(([x]) => x !== t)
    if (d === 1 || Math.random() < 0.5) return mcq(`Which key term means: “${def}”?`, t, others.map(([x]) => x), [`**${t}**: ${def}`])
    return mcq(`What does **${t}** mean?`, def, others.map(([, x]) => x), [`**${t}**: ${def}`])
  }
}
