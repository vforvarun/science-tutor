// Number helpers for question generators and answer checking.

export const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1))
export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
/** random non-zero integer in [a,b] */
export const nz = (a: number, b: number) => {
  let n = 0
  while (n === 0) n = ri(a, b)
  return n
}
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

export const round = (n: number, dp = 2) => Math.round(n * 10 ** dp) / 10 ** dp

/** Format a number nicely: trims trailing zeros, uses minus sign. */
export function fmt(n: number, dp = 2): string {
  const r = round(n, dp)
  const s = Number.isInteger(r) ? String(r) : r.toFixed(dp).replace(/0+$/, '').replace(/\.$/, '')
  return s.replace('-', '−')
}
/** For LaTeX: plain minus */
export const tx = (n: number, dp = 2) => fmt(n, dp).replace('−', '-')

/** Money with 2 dp and thousands separators */
export const money = (n: number) => '\\$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const moneyPlain = (n: number) => '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Parse a typed answer: "3", "-2.5", "−4", "3/4", "1,200", "x=3", "12 N", "3.5 m/s", "2×10^3 J", "4.5e-3" */
export function parseNum(input: string): number | null {
  let s = input.trim().toLowerCase().replace(/−|–/g, '-').replace(/\s+/g, '').replace(/^[a-z]=/, '').replace(/^\$/, '')
  s = s.replace(/[x×*]10\^?\(?(-?\d+)\)?/, 'e$1') // scientific notation
  const m = s.match(/^(-?(?:\d[\d,]*(?:\.\d+)?|\.\d+)(?:\/-?\d+(?:\.\d+)?)?(?:e-?\d+)?)(.*)$/)
  if (!m) return null
  // anything after the number must look like a unit (N, m/s, J, Ω, °C, %, kg…)
  if (m[2] && !/^[a-zωµ°%²³][a-zωµ°%²³/^·\-\d]*$/.test(m[2])) return null
  let n = m[1].replace(/,(?=\d{3}(\D|$))/g, '')
  if (n.includes(',')) return null
  const frac = n.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/)
  if (frac) {
    const d = parseFloat(frac[2])
    return d === 0 ? null : parseFloat(frac[1]) / d
  }
  n = n.replace(/^(-?)\./, '$10.')
  const v = parseFloat(n)
  return Number.isFinite(v) ? v : null
}

export function close(a: number, b: number, tol = 0.011): boolean {
  return Math.abs(a - b) <= tol + 1e-9
}

export const sq = (n: number) => n * n
/** significant-figure rounding */
export const sig = (n: number, k = 3) => (n === 0 ? 0 : +n.toPrecision(k))
