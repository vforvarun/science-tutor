// Stress-tests every question generator and all lesson maths.
import katex from 'katex'
import 'katex/contrib/mhchem'
import { TOPICS } from '../src/data/topics'
import { SCENES } from '../src/scenes'
import { warmupQuestion } from '../src/gens/warmup'
import type { Problem, Level } from '../src/lib/problem'
import { diagnose, updateSmart } from '../src/lib/smart'
import { parseNum } from '../src/lib/num'

// SmartScore sanity: perfect requires sustained accuracy
{
  let s = 0
  let n = 0
  while (s < 100 && n < 200) {
    s = updateSmart(s, true)
    n++
  }
  console.log(`SmartScore: ${n} correct answers in a row reach 100`)
  let t = 0
  for (let i = 0; i < 400; i++) t = updateSmart(t, i % 5 !== 0) // 80% accuracy
  console.log(`SmartScore at steady 80% accuracy settles at ${t}`)
}

let problems = 0
const seen = new Set<string>()
const bad = (m: string) => {
  if (seen.has(m)) return
  seen.add(m)
  problems++
  if (problems < 40) console.log('✗', m)
}

function mathOk(text: string, where: string) {
  const t = text.replaceAll('\\$', '\u0001')
  const re = /\$\$([^$]+)\$\$|\$([^$]+)\$/g
  let m
  while ((m = re.exec(t))) {
    const tex = (m[1] ?? m[2]).replaceAll('\u0001', '\\$')
    try {
      katex.renderToString(tex, { throwOnError: true, strict: false })
    } catch (e) {
      bad(`${where}: KaTeX error in "${tex}": ${(e as Error).message.slice(0, 80)}`)
    }
  }
  const stray = t.replace(re, '').match(/\$/g)
  if (stray) bad(`${where}: unmatched $ in "${text.slice(0, 80)}"`)
  if (/undefined|NaN|Infinity|\[object/.test(text.replace(/\\ce\{[^}]*\}/g, ''))) bad(`${where}: bad value in "${text.slice(0, 100)}"`)
}

function checkProblem(p: Problem, where: string) {
  mathOk(p.q, where + ' q')
  p.steps.forEach((s) => mathOk(s, where + ' step'))
  if (p.hint) mathOk(p.hint, where + ' hint')
  if (!p.steps.length) bad(`${where}: no steps`)
  if (p.kind === 'num' && !Number.isFinite(p.ans)) bad(`${where}: non-finite answer ${p.ans}`)
  if (p.kind === 'mcq') {
    if (!p.options || p.options.length < 4) bad(`${where}: only ${p.options?.length} options`)
    else if (new Set(p.options).size !== p.options.length) bad(`${where}: duplicate options ${p.options}`)
    p.options?.forEach((o) => mathOk(o, where + ' option'))
  }
  if (p.kind === 'multi') p.fields!.forEach((f) => !Number.isFinite(f.ans) && bad(`${where}: non-finite field ${f.label}`))
  // mistake diagnosis must never crash and must render
  const topic = where.split('#')[0]
  const wrongs: string[][] =
    p.kind === 'num' ? [[String(-p.ans!)], [String(p.ans! * p.ans!)], [String(p.ans! * 10)], [String(p.ans! + 0.1)], ['abc'], [String(p.ans! + 7)]] : p.kind === 'multi' ? [p.fields!.map((f) => String(-f.ans)), p.fields!.map((f, i) => (i ? '999' : String(f.ans))), p.fields!.map(() => '')] : [[]]
  for (const w of wrongs) {
    const msg = diagnose(p, w, topic)
    if (msg) mathOk(msg, where + ' diagnose')
  }
  if (p.kind === 'num' && p.ans !== 0 && !diagnose(p, [String(-p.ans!)], topic)) bad(`${where}: sign slip not diagnosed`)
  // answers typed with their unit must still be accepted
  if (p.kind === 'num' && p.unit && parseNum(`${p.ans} ${p.unit}`) !== p.ans) bad(`${where}: answer with unit "${p.ans} ${p.unit}" not parsed`)
  if (p.kind === 'mcq' && p.options!.some((o) => o.length > 140)) bad(`${where}: very long option`)
}

let count = 0
for (const t of TOPICS) {
  if (!SCENES[t.scene]) bad(`${t.id}: missing scene ${t.scene}`)
  if (t.terms.length < 5) bad(`${t.id}: needs at least 5 key terms`)
  if (t.skills.length !== t.gens.length) bad(`${t.id}: skills/gens mismatch`)
  t.terms.forEach(([a, b]) => mathOk(a + ' ' + b, t.id + ' term'))
  mathOk(t.lesson, t.id + ' lesson')
  mathOk(t.analogy.text, t.id + ' analogy')
  t.examples.forEach((e) => [e.q, ...e.steps].forEach((s) => mathOk(s, t.id + ' example')))
  t.mistakes.forEach((m) => mathOk(m, t.id + ' mistake'))
  t.formulas.forEach((f) => {
    try {
      katex.renderToString(f, { throwOnError: true })
    } catch (e) {
      bad(`${t.id} formula "${f}": ${(e as Error).message.slice(0, 60)}`)
    }
  })
  t.gens.forEach((g, gi) => {
    for (const d of [1, 2, 3] as Level[]) {
      for (let k = 0; k < 400; k++) {
        try {
          checkProblem(g(d), `${t.id}#${gi} d${d}`)
          count++
        } catch (e) {
          bad(`${t.id}#${gi} d${d}: threw ${(e as Error).message}`)
        }
      }
    }
  })
}
for (const s of Object.values(SCENES)) s.steps.forEach((x) => mathOk(x, 'scene ' + s.id))
for (let k = 0; k < 500; k++) checkProblem(warmupQuestion(10), 'warmup')

console.log(`${TOPICS.length} topics, ${Object.keys(SCENES).length} animated lessons, ${TOPICS.reduce((a, t) => a + t.gens.length, 0)} generators, ${count} questions generated`)
console.log(problems ? `${problems} problem(s)` : 'All generator checks passed ✓')
process.exit(problems ? 1 : 0)
