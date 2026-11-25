// SmartScore (IXL-style) mastery scoring and mistake diagnosis.
import type { Level, Problem } from './problem'
import { parseNum, close } from './num'

export const PERFECT = 100

/** Points gained/lost. Gains shrink near 100; losses grow in the Challenge Zone. */
export function updateSmart(score: number, ok: boolean): number {
  if (ok) {
    const gain = score < 40 ? 12 : score < 60 ? 8 : score < 75 ? 6 : score < 90 ? 4 : 2
    return Math.min(PERFECT, score + gain)
  }
  const loss = score < 40 ? 3 : score < 60 ? 5 : score < 75 ? 6 : score < 90 ? 8 : 10
  return Math.max(0, score - loss)
}

export function difficultyFor(score: number): Level {
  return score < 40 ? 1 : score < 75 ? 2 : 3
}

export interface Zone {
  name: string
  emoji: string
  color: string
  blurb: string
}
export function zoneFor(score: number): Zone {
  if (score >= PERFECT) return { name: 'Mastered!', emoji: '🏆', color: '#2ec4b6', blurb: 'Perfect score. You’ve mastered this topic!' }
  if (score >= 90) return { name: 'Challenge Zone', emoji: '🔥', color: '#ff6b6b', blurb: 'Harder questions. Each mistake costs more — slow down and check.' }
  if (score >= 75) return { name: 'Almost there', emoji: '🚀', color: '#ffbe0b', blurb: 'Great progress. Keep your accuracy up to reach the Challenge Zone at 90.' }
  if (score >= 40) return { name: 'Improving', emoji: '📈', color: '#3a86ff', blurb: 'You’re getting the hang of it. Questions are getting a little harder.' }
  return { name: 'Warming up', emoji: '🌱', color: '#6246ea', blurb: 'Building the basics. Take your time and use the hints.' }
}

/** Try to explain WHY a numeric answer is wrong, by spotting common slips. */
export function diagnose(p: Problem, vals: string[], topic?: string): string | null {
  if (p.kind === 'mcq') return null
  const tol = p.tol ?? 0.011
  const near = (a: number, b: number) => close(a, b, Math.max(tol, Math.abs(b) * 0.002))

  if (p.kind === 'multi') {
    const nums = vals.map(parseNum)
    if (nums.some((n) => n === null)) return 'Fill in every box with a number (fractions like 3/4 and negatives like −2 are fine).'
    const answers = p.fields!.map((f) => f.ans)
    if (nums.every((n, i) => near(-n!, p.unordered ? answers.find((a) => near(-n!, a)) ?? NaN : answers[i]))) return 'All your signs are flipped — check which quantities should be negative.'
    const rightCount = p.unordered ? nums.filter((n) => answers.some((a) => near(n!, a))).length : nums.filter((n, i) => near(n!, answers[i])).length
    if (!p.unordered && nums.length === 2 && near(nums[0]!, answers[1]) && near(nums[1]!, answers[0])) return 'You have the right numbers in the wrong boxes — check which value goes where.'
    if (rightCount > 0) return `${rightCount} of your ${nums.length} answers ${rightCount === 1 ? 'is' : 'are'} right — check the other one carefully.`
    return null
  }

  const v = parseNum(vals[0] ?? '')
  const a = p.ans!
  if (v === null) return 'That doesn’t look like a number. Type the number (you can add a unit, like 12 N or 3.5 m/s).'
  if (a !== 0 && near(v, -a)) return 'Right size, wrong sign! Check whether the quantity should be negative — e.g. a car slowing down has a negative acceleration.'
  if ((!Number.isInteger(a) || /decimal|nearest|significant/i.test(p.q)) && Math.abs(v - a) <= Math.max(0.15, Math.abs(a) * 0.01)) return 'Very close! Check your rounding — keep full calculator accuracy until the end, then round as asked.'
  if (a !== 0 && (near(v, a * 3.6) || near(v, a / 3.6))) return 'Unit slip! To change km/h to m/s divide by 3.6; to change m/s to km/h multiply by 3.6.'
  if (a !== 0 && (near(v, a * 60) || near(v, a / 60) || near(v, a * 3600) || near(v, a / 3600))) return 'Check your time units — minutes and hours need converting to seconds (× 60, × 3600).'
  for (const k of [10, 100, 1000]) if (near(v, a * k) || near(v, a / k)) return 'The digits look right but the size is off by a power of ten. Check unit conversions (g → kg ÷ 1000, cm → m ÷ 100, mA → A ÷ 1000) and the decimal point.'
  if (a !== 0 && v !== 0 && near(v, 1 / a)) return 'Your answer is upside down — you may have divided the wrong way round. Write the formula first, then rearrange.'
  if (a > 1 && near(v, a * a)) return 'It looks like you squared something you didn’t need to (or forgot a square root).'
  if (a > 1 && near(v * v, a)) return 'Did you forget to square? In $E_k = \\tfrac12 mv^2$ the speed is squared.'
  if (a !== 0 && (near(v, a * 2) || near(v, a / 2))) return 'You’re out by a factor of 2. Check for a ½ — like in $E_k = \\tfrac12 mv^2$ — or count half-lives carefully.'
  if (topic === 'electricity') return 'Write $V = IR$ in the triangle: cover what you want. In **series** add resistances; in **parallel** the voltage across each branch is the full supply voltage.'
  if (topic === 'motion' || topic === 'forces') return 'Write the formula first, then substitute with units. Check: is it speed ($d/t$), acceleration ($\\Delta v / t$) or force ($ma$)?'
  if (topic === 'radioactivity') return 'Count the half-lives first (total time ÷ half-life), then halve that many times.'
  if (topic === 'energy') return 'Use $E_k = \\tfrac12 mv^2$ for moving objects and $E_p = mgh$ for height (g = 9.8 N/kg). Mass must be in kg.'
  return null
}
