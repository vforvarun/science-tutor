// Calculation & procedural question generators. Every call gives fresh numbers.
import { mcq, num, multi, type Gen, type Fig } from '../lib/problem'
import { ri, pick, round, tx, shuffle } from '../lib/num'

const f1 = (n: number) => tx(round(n, 1), 1)
const f2 = (n: number) => tx(round(n, 2), 2)

// ================= Elements (first 20) =================
export const ELEMENTS = [
  // Z, symbol, name, mass number, group
  [1, 'H', 'hydrogen', 1, 1], [2, 'He', 'helium', 4, 18], [3, 'Li', 'lithium', 7, 1], [4, 'Be', 'beryllium', 9, 2],
  [5, 'B', 'boron', 11, 13], [6, 'C', 'carbon', 12, 14], [7, 'N', 'nitrogen', 14, 15], [8, 'O', 'oxygen', 16, 16],
  [9, 'F', 'fluorine', 19, 17], [10, 'Ne', 'neon', 20, 18], [11, 'Na', 'sodium', 23, 1], [12, 'Mg', 'magnesium', 24, 2],
  [13, 'Al', 'aluminium', 27, 13], [14, 'Si', 'silicon', 28, 14], [15, 'P', 'phosphorus', 31, 15], [16, 'S', 'sulfur', 32, 16],
  [17, 'Cl', 'chlorine', 35, 17], [18, 'Ar', 'argon', 40, 18], [19, 'K', 'potassium', 39, 1], [20, 'Ca', 'calcium', 40, 2],
] as const
export const shells = (z: number) => [2, 8, 8, 2].reduce<number[]>((acc, cap) => {
  const used = acc.reduce((a, b) => a + b, 0)
  if (used < z) acc.push(Math.min(cap, z - used))
  return acc
}, [])
const atomFig = (z: number): Fig => {
  const e = ELEMENTS[z - 1]
  return { type: 'atom', symbol: e[1], p: z, n: e[3] - z, shells: shells(z) }
}

export const subatomic: Gen = (d) => {
  const e = pick(ELEMENTS.slice(d === 1 ? 0 : 2, d === 1 ? 12 : 20))
  const [z, sym, name, a] = e
  const which = pick(['protons', 'neutrons', 'electrons'] as const)
  const ans = which === 'neutrons' ? a - z : z
  return num(`An atom of ${name} is written $^{${a}}_{${z}}\\text{${sym}}$. How many **${which}** does it have?`, ans, [
    `The bottom number is the **atomic number** = protons = ${z}.`,
    which === 'neutrons' ? `Neutrons = mass number − atomic number = ${a} − ${z} = ${a - z}.` : which === 'electrons' ? `A neutral atom has as many electrons as protons: ${z}.` : `So there are ${z} protons.`,
  ], { hint: 'Top number = protons + neutrons. Bottom number = protons.' })
}

export const isotopeQ: Gen = () => {
  const [z, sym, name, a] = pick(ELEMENTS.slice(5, 20))
  const a2 = a + pick([1, 2, -1].filter((k) => a + k > z * 2 - 4))
  return multi(`${name[0].toUpperCase() + name.slice(1)} has an isotope $^{${a2}}_{${z}}\\text{${sym}}$. Fill in its particles.`, [
    { label: 'protons', ans: z },
    { label: 'neutrons', ans: a2 - z },
    { label: 'electrons', ans: z },
  ], [`Isotopes have the **same number of protons** (${z}) but a different number of neutrons.`, `Neutrons = ${a2} − ${z} = ${a2 - z}; electrons = protons = ${z}.`])
}

export const electronShells: Gen = () => {
  const [z, , name] = pick(ELEMENTS.slice(2, 20))
  const sh = shells(z)
  const wrong = [sh.map((x, i) => (i === sh.length - 1 ? x + 1 : x)), z > 10 ? [2, z - 2] : [1, z - 1], [...sh].reverse(), sh.length > 1 ? [sh[0] - 0, ...sh.slice(1)].map((x, i) => (i === 0 ? 8 : x)) : [z]].map((x) => x.join(', '))
  return mcq(`What is the electron configuration of ${name} (${z} electrons)?`, sh.join(', '), wrong, [`Fill shells in order: 2 in the first, then 8, then 8, then the rest.`, `${z} electrons → ${sh.join(', ')}`], undefined, atomFig(z))
}

// ================= Periodic table =================
const valence = (g: number) => (g <= 2 ? g : g - 10)
export const groupPeriod: Gen = (d) => {
  const [z, sym, name, , g] = pick(ELEMENTS.slice(2, 20).filter((e) => e[4] !== 18 || d > 1))
  const sh = shells(z)
  if (d === 1 || Math.random() < 0.4) {
    return num(`How many **outer-shell (valence) electrons** does an atom of ${name} (${sym}, atomic number ${z}) have?`, valence(g), [`Electron configuration: ${sh.join(', ')}.`, `The last shell holds ${valence(g)} — that's why it's in group ${g}.`], { fig: atomFig(z) })
  }
  return num(`Which **period** (row) of the periodic table is ${name} (atomic number ${z}) in?`, sh.length, [`Electron configuration: ${sh.join(', ')} — that's ${sh.length} occupied shells.`, `Number of shells = period number = ${sh.length}.`])
}

const IONS: Record<string, [string, number]> = { Li: ['lithium', 1], Na: ['sodium', 1], K: ['potassium', 1], Mg: ['magnesium', 2], Ca: ['calcium', 2], Be: ['beryllium', 2], Al: ['aluminium', 3] }
const ANIONS: Record<string, [string, number]> = { F: ['fluoride', 1], Cl: ['chloride', 1], O: ['oxide', 2], S: ['sulfide', 2], N: ['nitride', 3] }
const gcdN = (a: number, b: number): number => (b ? gcdN(b, a % b) : a)
const formula = (m: string, x: number, n: string, y: number) => `\\ce{${m}${x > 1 ? x : ''}${n}${y > 1 ? y : ''}}`
export const ionicFormula: Gen = (d) => {
  const m = pick(Object.keys(IONS).filter((k) => d > 1 || IONS[k][1] < 3))
  const n = pick(Object.keys(ANIONS).filter((k) => d === 3 || ANIONS[k][1] < 3))
  const [mq, nq] = [IONS[m][1], ANIONS[n][1]]
  const g = gcdN(mq, nq)
  const [x, y] = [nq / g, mq / g]
  const right = formula(m, x, n, y)
  const cands: [number, number][] = [[y, x], [1, 1], [mq, nq], [x + 1, y], [x, y + 1], [x * 2, y * 2], [x + 2, y]]
  const wrong = [...new Set(cands.map(([a, b]) => formula(m, a, n, b)))].filter((f) => f !== right).map((w) => '$' + w + '$')
  const ch = (q: number, s: string) => `${q > 1 ? q : ''}${s}`
  return mcq(`What is the formula of ${IONS[m][0]} ${ANIONS[n][0]}? (Ions: $\\ce{${m}^{${ch(mq, '+')}}}$ and $\\ce{${n}^{${ch(nq, '-')}}}$)`, '$' + right + '$', wrong, [`The charges must cancel out to zero.`, `${x} × (+${mq}) + ${y} × (−${nq}) = 0 → $${right}$`, `Shortcut: swap the charge numbers and simplify.`])
}

// ================= Chemical reactions =================
// [reactants, products] as [coef, formula]; first entry checks
const EQS: { r: [number, string][]; p: [number, string][]; name: string }[] = [
  { r: [[2, 'H2'], [1, 'O2']], p: [[2, 'H2O']], name: 'hydrogen burning' },
  { r: [[1, 'CH4'], [2, 'O2']], p: [[1, 'CO2'], [2, 'H2O']], name: 'methane combustion' },
  { r: [[2, 'Mg'], [1, 'O2']], p: [[2, 'MgO']], name: 'magnesium burning' },
  { r: [[1, 'N2'], [3, 'H2']], p: [[2, 'NH3']], name: 'making ammonia' },
  { r: [[2, 'Na'], [1, 'Cl2']], p: [[2, 'NaCl']], name: 'making salt' },
  { r: [[1, 'Mg'], [2, 'HCl']], p: [[1, 'MgCl2'], [1, 'H2']], name: 'magnesium + acid' },
  { r: [[4, 'Fe'], [3, 'O2']], p: [[2, 'Fe2O3']], name: 'iron rusting' },
  { r: [[1, 'C3H8'], [5, 'O2']], p: [[3, 'CO2'], [4, 'H2O']], name: 'propane combustion' },
  { r: [[2, 'H2O2']], p: [[2, 'H2O'], [1, 'O2']], name: 'hydrogen peroxide decomposing' },
  { r: [[1, 'CaCO3'], [2, 'HCl']], p: [[1, 'CaCl2'], [1, 'H2O'], [1, 'CO2']], name: 'chalk + acid' },
]
const subs = (f: string) => f.replace(/\d/g, (n) => '₀₁₂₃₄₅₆₇₈₉'[+n])
const side = (xs: [number, string][], blank?: number) => xs.map(([c, f], i) => (i === blank ? `\\square\\,${f}` : `${c > 1 ? c : ''}${f}`)).join(' + ')
export const balance: Gen = (d) => {
  const e = pick(d === 1 ? EQS.slice(0, 5) : EQS)
  const all = [...e.r, ...e.p]
  const nb = d === 1 ? 1 : 2
  const idx = shuffle(all.map((_, i) => i).filter((i) => all[i][0] > 1 || d === 3)).slice(0, nb).sort((a, b) => a - b)
  if (!idx.length) idx.push(all.findIndex(([c]) => c > 1))
  const show = (xs: [number, string][], off: number) => xs.map(([c, f], i) => (idx.includes(i + off) ? `\\square\\,${f}` : `${c > 1 ? c : ''}${f}`)).join(' + ')
  const eq = `\\ce{${show(e.r, 0)} -> ${show(e.p, e.r.length)}}`
  return multi(`Balance the equation for ${e.name}. Fill in the missing numbers: $${eq}$`, idx.map((i, k) => ({ label: `box ${k + 1} (${subs(all[i][1])})`, ans: all[i][0] })), [
    `Count each type of atom on both sides — they must be equal (atoms are never created or destroyed).`,
    `Balanced: $\\ce{${side(e.r)} -> ${side(e.p)}}$`,
  ], { hint: 'Change the big numbers in front, never the small ones in a formula.' })
}

export const conserveMass: Gen = (d) => {
  const a = ri(20, 90)
  const b = ri(5, 60)
  if (d >= 2 && Math.random() < 0.5) {
    const gas = ri(2, Math.min(15, a + b - 5))
    return num(`${a} g of marble chips react with ${b} g of acid in an **open** beaker. Afterwards the beaker’s contents weigh ${a + b - gas} g. What mass of carbon dioxide gas escaped?`, gas, [`Mass is conserved: total before = ${a + b} g.`, `The missing mass left as gas: ${a + b} − ${a + b - gas} = ${gas} g.`], { unit: 'g', hint: 'In an open container, a gas product escapes.' })
  }
  return num(`${a} g of iron reacts completely with ${b} g of sulfur in a sealed tube. What mass of iron sulfide is made?`, a + b, [`Law of conservation of mass: atoms are rearranged, never created or destroyed.`, `Mass of products = mass of reactants = ${a} + ${b} = ${a + b} g.`], { unit: 'g' })
}

// ================= Radioactivity =================
export const halfLife: Gen = (d) => {
  const hl = pick([2, 5, 8, 10, 12, 15, 20, 30])
  const n = d === 1 ? ri(1, 3) : ri(2, 5)
  const start = pick([80, 160, 320, 400, 640, 800, 1000, 1600])
  const left = start / 2 ** n
  const unit = pick(['days', 'years', 'hours'])
  const pts: [number, number][] = Array.from({ length: 41 }, (_, i) => [(i / 40) * hl * 5, start / 2 ** ((i / 40) * 5)])
  const fig: Fig = { type: 'plot', series: [{ pts }], xLabel: `time (${unit})`, yLabel: 'mass (g)', xMax: hl * 5, yMax: start, xStep: hl, yStep: start / 4 }
  if (d === 3 && Math.random() < 0.5) {
    return num(`A sample of ${start} g has a half-life of ${hl} ${unit}. How long until only ${left} g is left?`, n * hl, [`Halve until you reach ${left}: ${Array.from({ length: n + 1 }, (_, i) => start / 2 ** i).join(' → ')} g`, `That’s ${n} half-lives × ${hl} = ${n * hl} ${unit}.`], { unit, fig })
  }
  return num(`A radioactive sample of ${start} g has a half-life of ${hl} ${unit}. How much is left after ${n * hl} ${unit}?`, left, [`Number of half-lives = ${n * hl} ÷ ${hl} = ${n}.`, `Halve ${n} times: ${Array.from({ length: n + 1 }, (_, i) => start / 2 ** i).join(' → ')} g`], { unit: 'g', hint: 'Work out how many half-lives have passed first.', fig: d === 1 ? fig : undefined })
}

export const decayEq: Gen = (d) => {
  const items = [[238, 92, 'U', 'Th'], [226, 88, 'Ra', 'Rn'], [210, 84, 'Po', 'Pb'], [222, 86, 'Rn', 'Po'], [232, 90, 'Th', 'Ra']] as const
  const betas = [[14, 6, 'C', 'N'], [131, 53, 'I', 'Xe'], [90, 38, 'Sr', 'Y'], [60, 27, 'Co', 'Ni'], [40, 19, 'K', 'Ca']] as const
  const alpha = d === 1 || Math.random() < 0.5
  const [A, Z, s, t] = alpha ? pick(items) : pick(betas)
  const [A2, Z2] = alpha ? [A - 4, Z - 2] : [A, Z + 1]
  return multi(`$^{${A}}_{${Z}}\\text{${s}}$ undergoes **${alpha ? 'alpha' : 'beta'} decay** to form ${t}. What are the new mass number and atomic number?`, [
    { label: 'mass number', ans: A2 },
    { label: 'atomic number', ans: Z2 },
  ], [alpha ? `An alpha particle is a helium nucleus $^{4}_{2}\\text{He}$: the nucleus loses 4 from the mass number and 2 from the atomic number.` : `In beta decay a neutron turns into a proton and an electron $^{0}_{-1}e$ is emitted: mass number stays the same, atomic number goes **up** by 1.`, `$^{${A}}_{${Z}}\\text{${s}} \\rightarrow\\ ^{${A2}}_{${Z2}}\\text{${t}} + ${alpha ? '^{4}_{2}\\text{He}' : '^{0}_{-1}e'}$`])
}

// ================= Ecosystems =================
export const energyPyramid: Gen = (d) => {
  const start = pick([10000, 20000, 50000, 100000, 25000, 40000])
  const chains = [['grass', 'grasshopper', 'frog', 'snake', 'eagle'], ['phytoplankton', 'krill', 'fish', 'seal', 'shark'], ['gum leaves', 'possum', 'owl'], ['wheat', 'mouse', 'snake', 'hawk']]
  const ch = pick(chains)
  const k = ri(1, Math.min(ch.length - 1, d + 1))
  const e = start * 0.1 ** k
  return num(`In the food chain ${ch.join(' → ')}, the ${ch[0]} store ${start.toLocaleString('en-AU')} kJ of energy. Using the 10% rule, how much energy reaches the ${ch[k]}?`, round(e, 3), [`Only about 10% of energy passes to the next level (the rest is lost as heat, movement and waste).`, `${ch[0]} → ${ch[k]} is ${k} step${k > 1 ? 's' : ''}: ${start.toLocaleString('en-AU')} × ${Array(k).fill('0.1').join(' × ')} = ${tx(e, 3)} kJ`], { unit: 'kJ', hint: 'Multiply by 0.1 for each arrow.' })
}

// ================= Genetics =================
export const punnett: Gen = (d) => {
  const traits = [['B', 'brown eyes', 'blue eyes'], ['T', 'tall', 'short'], ['R', 'round seeds', 'wrinkled seeds'], ['P', 'purple flowers', 'white flowers'], ['F', 'free earlobes', 'attached earlobes']] as const
  const [L, dom, rec] = pick(traits)
  const l = L.toLowerCase()
  const crosses: [string, string][] = d === 1 ? [[L + l, L + l], [L + l, l + l]] : [[L + l, L + l], [L + l, l + l], [L + L, l + l], [L + l, L + L]]
  const [p1, p2] = pick(crosses)
  const kids = [p1[0] + p2[0], p1[0] + p2[1], p1[1] + p2[0], p1[1] + p2[1]]
  const recN = kids.filter((g) => g === l + l).length
  const fig: Fig = { type: 'punnett', top: [p2[0], p2[1]], side: [p1[0], p1[1]] }
  if (d === 3 && Math.random() < 0.5) {
    const n = pick([40, 80, 120, 200])
    return num(`${dom[0].toUpperCase() + dom.slice(1)} ($${L}$) is dominant over ${rec} ($${l}$). Parents $${p1}$ × $${p2}$ have ${n} offspring. About how many would you expect to have **${rec}**?`, (n * recN) / 4, [`Punnett square: ${kids.join(', ')}.`, `${recN} of 4 squares are $${l}${l}$, so expect ${recN}/4 × ${n} = ${(n * recN) / 4}.`], { fig })
  }
  return num(`${dom[0].toUpperCase() + dom.slice(1)} ($${L}$) is dominant over ${rec} ($${l}$). Two parents $${p1}$ and $${p2}$ have a child. What is the percentage chance the child has **${rec}**?`, recN * 25, [`Fill in the Punnett square: ${kids.join(', ')}.`, `Only $${l}${l}$ shows the recessive trait: ${recN} of 4 squares = ${recN * 25}%.`], { unit: '%', hint: 'Each square of the Punnett square is a 25% chance.', fig })
}

export const basePairs: Gen = (d) => {
  const pair: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' }
  if (d >= 2 && Math.random() < 0.5) {
    const a = ri(10, 40)
    const ask = pick(['G', 'C', 'T'])
    const ans = ask === 'T' ? a : 50 - a
    return num(`In a DNA sample, ${a}% of the bases are adenine (A). What percentage are ${ask === 'G' ? 'guanine (G)' : ask === 'C' ? 'cytosine (C)' : 'thymine (T)'}?`, ans, [`A pairs with T, so T = A = ${a}%.`, `That leaves ${100 - 2 * a}% for G and C, which are equal: ${50 - a}% each.`], { unit: '%', hint: 'A = T and G = C.' })
  }
  const seq = Array.from({ length: d === 1 ? 6 : 9 }, () => pick(['A', 'T', 'C', 'G'])).join('')
  const comp = [...seq].map((b) => pair[b]).join('')
  const swapOne = (str: string, i: number) => str.slice(0, i) + ({ A: 'G', G: 'A', C: 'T', T: 'C' } as Record<string, string>)[str[i]] + str.slice(i + 1)
  const wrong = [[...seq].reverse().join(''), seq, [...comp].map((b) => (b === 'A' ? 'U' : b)).join(''), [...seq].map((b) => ({ A: 'G', G: 'A', C: 'T', T: 'C' })[b]).join(''), [...comp].reverse().join(''), swapOne(comp, 1), swapOne(comp, comp.length - 2)]
  return mcq(`What is the complementary DNA strand for **${seq}**?`, comp, wrong, ['A pairs with T, and C pairs with G.', `${seq} → ${comp}`], 'Apples in Trees, Cars in Garages.')
}

// ================= Electricity =================
export const ohm: Gen = (d) => {
  const R = pick([2, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 50, 100])
  const I = d === 1 ? ri(1, 5) : pick([0.2, 0.25, 0.5, 1.5, 2, 2.5, 3, 0.4, 0.1])
  const V = round(I * R, 2)
  const ask = d === 1 ? 'V' : pick(['V', 'I', 'R'])
  const fig: Fig = { type: 'circuit', kind: 'series', cell: ask === 'V' ? '? V' : `${V} V`, resistors: [ask === 'R' ? '? Ω' : `${R} Ω`], ammeter: true }
  if (ask === 'V') return num(`A current of ${I} A flows through a ${R} Ω resistor. What is the voltage across it?`, V, [`$V = IR$`, `$V = ${I} \\times ${R} = ${tx(V)}$ V`], { unit: 'V', fig })
  if (ask === 'I') return num(`A ${V} V supply is connected across a ${R} Ω resistor. What current flows?`, I, [`$I = \\dfrac{V}{R}$`, `$I = \\dfrac{${tx(V)}}{${R}} = ${tx(I)}$ A`], { unit: 'A', fig: { ...fig, resistors: [`${R} Ω`] } })
  return num(`A ${V} V supply drives a current of ${I} A through a resistor. What is its resistance?`, R, [`$R = \\dfrac{V}{I}$`, `$R = \\dfrac{${tx(V)}}{${tx(I)}} = ${R}$ Ω`], { unit: 'Ω', fig })
}

export const seriesParallel: Gen = (d) => {
  const rs = Array.from({ length: d === 3 ? 3 : 2 }, () => pick([2, 3, 4, 5, 6, 10, 12]))
  const Rt = rs.reduce((a, b) => a + b, 0)
  const Vs = pick([6, 9, 12, 24])
  if (d === 1 || Math.random() < 0.5) {
    const I = Vs / Rt
    return num(`Resistors of ${rs.join(' Ω, ')} Ω are connected **in series** to a ${Vs} V battery. What current flows (2 decimal places)?`, round(I, 2), [`In series, resistances add: $R_T = ${rs.join(' + ')} = ${Rt}$ Ω`, `$I = \\dfrac{V}{R_T} = \\dfrac{${Vs}}{${Rt}} \\approx ${f2(I)}$ A`], { unit: 'A', tol: 0.011, fig: { type: 'circuit', kind: 'series', cell: `${Vs} V`, resistors: rs.map((r) => `${r} Ω`), ammeter: true } })
  }
  const k = ri(0, rs.length - 1)
  const Ib = Vs / rs[k]
  const It = rs.reduce((a, r) => a + Vs / r, 0)
  const total = d === 3 && Math.random() < 0.5
  return num(`Resistors of ${rs.join(' Ω, ')} Ω are connected **in parallel** to a ${Vs} V battery. ${total ? 'What is the total current from the battery' : `What current flows through the ${rs[k]} Ω resistor`} (2 decimal places)?`, round(total ? It : Ib, 2), [
    `In parallel, **each branch gets the full ${Vs} V**.`,
    ...(total ? rs.map((r) => `$${Vs} \\div ${r} = ${f2(Vs / r)}$ A`).concat([`Total current = sum of branches ≈ ${f2(It)} A`]) : [`$I = \\dfrac{V}{R} = \\dfrac{${Vs}}{${rs[k]}} \\approx ${f2(Ib)}$ A`]),
  ], { unit: 'A', tol: 0.011, fig: { type: 'circuit', kind: 'parallel', cell: `${Vs} V`, resistors: rs.map((r) => `${r} Ω`) } })
}

// ================= Waves =================
export const waveEq: Gen = (d) => {
  const sound = Math.random() < 0.5
  const f = sound ? pick([170, 340, 425, 680, 850, 1700]) : pick([2, 4, 5, 0.5, 10, 20])
  const lam = sound ? 340 / f : pick([0.5, 1.5, 2, 3, 0.25, 4])
  const v = round(f * lam, 3)
  const ask = d === 1 ? 'v' : pick(['v', 'f', 'λ'])
  const what = sound ? 'A sound wave' : 'A water wave'
  const fig: Fig = { type: 'wave', wavelength: ask === 'λ' ? 'λ = ?' : `λ = ${tx(lam, 3)} m`, amplitude: 'A' }
  if (ask === 'v') return num(`${what} has a frequency of ${f} Hz and a wavelength of ${tx(lam, 3)} m. What is its speed?`, v, [`$v = f\\lambda$`, `$v = ${f} \\times ${tx(lam, 3)} = ${tx(v, 3)}$ m/s`], { unit: 'm/s', fig })
  if (ask === 'f') return num(`${what} travels at ${tx(v, 3)} m/s with a wavelength of ${tx(lam, 3)} m. What is its frequency?`, f, [`$f = \\dfrac{v}{\\lambda}$`, `$f = \\dfrac{${tx(v, 3)}}{${tx(lam, 3)}} = ${f}$ Hz`], { unit: 'Hz', fig })
  return num(`${what} travels at ${tx(v, 3)} m/s with a frequency of ${f} Hz. What is its wavelength?`, round(lam, 3), [`$\\lambda = \\dfrac{v}{f}$`, `$\\lambda = \\dfrac{${tx(v, 3)}}{${f}} = ${tx(lam, 3)}$ m`], { unit: 'm', fig })
}

export const echo: Gen = (d) => {
  const t = pick([0.5, 1, 1.5, 2, 3, 4]) * (d === 3 ? 1.2 : 1)
  const water = d >= 2 && Math.random() < 0.5
  const v = water ? 1500 : 340
  const dist = (v * t) / 2
  return num(`${water ? 'A ship’s sonar pulse' : 'You shout at a cliff and the echo'} returns after ${round(t, 2)} s. Sound travels at ${v} m/s in ${water ? 'water' : 'air'}. How far away is the ${water ? 'sea floor' : 'cliff'}?`, round(dist, 1), [`Total distance travelled = speed × time = ${v} × ${round(t, 2)} = ${round(v * t, 1)} m`, `That’s there **and back**, so halve it: ${f1(dist)} m`], { unit: 'm', hint: 'An echo travels there and back.' })
}

// ================= Motion =================
export const speedQ: Gen = (d) => {
  const v = pick([2, 4, 5, 8, 10, 12, 15, 20, 25])
  const t = pick([4, 5, 8, 10, 12, 20, 30, 60])
  const dd = v * t
  if (d === 3 && Math.random() < 0.5) {
    const kmh = pick([36, 54, 72, 90, 108])
    return num(`A car travels at ${kmh} km/h. What is this speed in m/s?`, kmh / 3.6, [`1 km/h = 1000 m ÷ 3600 s, so divide by 3.6.`, `${kmh} ÷ 3.6 = ${kmh / 3.6} m/s`], { unit: 'm/s', hint: 'km/h → m/s: divide by 3.6.' })
  }
  const ask = d === 1 ? 'v' : pick(['v', 'd', 't'])
  if (ask === 'v') return num(`A cyclist travels ${dd} m in ${t} s. What is their average speed?`, v, [`$v = \\dfrac{d}{t}$`, `$v = \\dfrac{${dd}}{${t}} = ${v}$ m/s`], { unit: 'm/s' })
  if (ask === 'd') return num(`A runner moves at ${v} m/s for ${t} s. How far do they travel?`, dd, [`$d = v \\times t$`, `$d = ${v} \\times ${t} = ${dd}$ m`], { unit: 'm' })
  return num(`How long does it take to travel ${dd} m at ${v} m/s?`, t, [`$t = \\dfrac{d}{v}$`, `$t = \\dfrac{${dd}}{${v}} = ${t}$ s`], { unit: 's' })
}

export const accelQ: Gen = (d) => {
  const u = d === 1 ? 0 : pick([0, 2, 5, 10, 20])
  const a = pick([0.5, 1, 2, 2.5, 3, 4, 5]) * (d === 3 && Math.random() < 0.4 ? -1 : 1)
  const t = pick([2, 4, 5, 6, 8, 10])
  const v = u + a * t
  if (v < 0) return accelQ(d)
  return num(`A ${a < 0 ? 'car brakes' : 'car speeds up'} from ${u} m/s to ${v} m/s in ${t} s. What is its acceleration?${a < 0 ? ' (Use a negative sign for slowing down.)' : ''}`, a, [`$a = \\dfrac{v - u}{t}$`, `$a = \\dfrac{${v} - ${u}}{${t}} = ${tx(a)}$ m/s²`], { unit: 'm/s²', hint: 'Change in velocity ÷ time.' })
}

export const dtGraph: Gen = (d) => {
  const v1 = pick([1, 2, 3, 4, 5])
  const t1 = pick([2, 4, 5])
  const rest = d >= 2
  const t2 = t1 + (rest ? pick([2, 3]) : 0)
  const v2 = pick([1, 2, 3].filter((x) => x !== v1))
  const t3 = t2 + pick([2, 3, 4])
  const d1 = v1 * t1
  const d3 = d1 + v2 * (t3 - t2)
  const pts: [number, number][] = [[0, 0], [t1, d1], [t2, d1], [t3, d3]]
  const yMax = Math.ceil(d3 / 5) * 5 + 5
  const fig: Fig = { type: 'plot', series: [{ pts }], xLabel: 'time (s)', yLabel: 'distance (m)', xMax: Math.ceil(t3 / 2) * 2, yMax, xStep: 2, yStep: yMax > 30 ? 10 : 5, dots: true }
  if (rest && Math.random() < 0.4) return mcq(`The graph shows a person’s journey. What were they doing from ${t1} s to ${t2} s?`, 'Standing still', ['Moving at a constant speed', 'Speeding up', 'Going backwards'], ['A flat (horizontal) line on a distance–time graph means distance isn’t changing — stopped.'], undefined, fig)
  return num(`The graph shows a person’s journey. What is their speed during the first ${t1} seconds?`, v1, [`Speed = gradient of a distance–time graph = rise ÷ run.`, `$\\dfrac{${d1} \\text{ m}}{${t1} \\text{ s}} = ${v1}$ m/s`], { unit: 'm/s', fig })
}

// ================= Forces =================
export const fma: Gen = (d) => {
  const m = pick([2, 5, 10, 50, 60, 800, 1200, 1500])
  const a = pick([0.5, 1, 2, 3, 4, 5])
  const F = m * a
  const ask = d === 1 ? 'F' : pick(['F', 'a', 'm'])
  if (d === 3 && Math.random() < 0.5) {
    const drive = F + pick([100, 200, 500].map((x) => (m < 100 ? x / 10 : x)))
    const fric = drive - F
    return num(`A ${m} kg ${m > 100 ? 'car' : 'trolley'} has a driving force of ${drive} N and friction of ${fric} N. What is its acceleration?`, a, [`Net force = ${drive} − ${fric} = ${F} N (forces in opposite directions subtract).`, `$a = \\dfrac{F}{m} = \\dfrac{${F}}{${m}} = ${tx(a)}$ m/s²`], { unit: 'm/s²', hint: 'Find the NET force first.' })
  }
  if (ask === 'F') return num(`What force is needed to accelerate a ${m} kg object at ${a} m/s²?`, F, [`$F = ma$`, `$F = ${m} \\times ${a} = ${F}$ N`], { unit: 'N' })
  if (ask === 'a') return num(`A net force of ${F} N acts on a ${m} kg object. What is its acceleration?`, a, [`$a = \\dfrac{F}{m}$`, `$a = \\dfrac{${F}}{${m}} = ${tx(a)}$ m/s²`], { unit: 'm/s²' })
  return num(`A net force of ${F} N gives an object an acceleration of ${a} m/s². What is its mass?`, m, [`$m = \\dfrac{F}{a}$`, `$m = \\dfrac{${F}}{${a}} = ${m}$ kg`], { unit: 'kg' })
}

export const weightQ: Gen = (d) => {
  const m = pick([0.5, 2, 5, 10, 45, 60, 70])
  const planets = [['Earth', 9.8], ['the Moon', 1.6], ['Mars', 3.7], ['Jupiter', 24.8]] as const
  const [pl, g] = d === 1 ? planets[0] : pick(planets)
  const W = round(m * g, 2)
  if (d === 3 && Math.random() < 0.4) return num(`An astronaut has a weight of ${W} N on ${pl} (g = ${g} N/kg). What is their mass?`, m, [`$m = \\dfrac{W}{g} = \\dfrac{${W}}{${g}} = ${m}$ kg`, 'Mass is the same everywhere — only weight changes.'], { unit: 'kg' })
  return num(`What is the weight of a ${m} kg object on ${pl}, where g = ${g} N/kg?`, W, [`$W = mg$`, `$W = ${m} \\times ${g} = ${tx(W)}$ N`], { unit: 'N', hint: 'Weight is a force, measured in newtons.' })
}

// ================= Energy =================
export const energyQ: Gen = (d) => {
  const kind = d === 1 ? pick(['ke', 'gpe']) : pick(['ke', 'gpe', 'drop', 'eff'])
  if (kind === 'ke') {
    const m = pick([2, 4, 10, 50, 60, 1000])
    const v = pick([2, 3, 4, 5, 10, 20])
    const E = 0.5 * m * v * v
    return num(`What is the kinetic energy of a ${m} kg object moving at ${v} m/s?`, E, [`$E_k = \\tfrac12 mv^2$`, `$E_k = \\tfrac12 \\times ${m} \\times ${v}^2 = \\tfrac12 \\times ${m} \\times ${v * v} = ${E}$ J`], { unit: 'J', hint: 'Square the speed first.' })
  }
  if (kind === 'gpe') {
    const m = pick([0.5, 2, 5, 10, 50, 60])
    const h = pick([2, 5, 10, 20, 30])
    const E = round(m * 9.8 * h, 2)
    return num(`How much gravitational potential energy does a ${m} kg object gain when lifted ${h} m? (g = 9.8 N/kg)`, E, [`$E_p = mgh$`, `$E_p = ${m} \\times 9.8 \\times ${h} = ${tx(E)}$ J`], { unit: 'J' })
  }
  if (kind === 'drop') {
    const h = pick([5, 10, 20, 45, 80])
    const v = Math.sqrt(2 * 9.8 * h)
    return num(`A ball is dropped from ${h} m. Ignoring air resistance, how fast is it moving just before it hits the ground? (g = 9.8 N/kg, 1 decimal place)`, round(v, 1), [`Energy is conserved: all $E_p$ becomes $E_k$, so $mgh = \\tfrac12 mv^2$ (the mass cancels).`, `$v = \\sqrt{2gh} = \\sqrt{2 \\times 9.8 \\times ${h}} \\approx ${f1(v)}$ m/s`], { unit: 'm/s', tol: 0.06 })
  }
  const inp = pick([100, 200, 500, 1000, 60, 40])
  const pc = pick([10, 20, 25, 40, 60, 75, 90])
  return num(`A device uses ${inp} J of energy and gives out ${(inp * pc) / 100} J of useful energy. What is its efficiency?`, pc, [`$\\text{efficiency} = \\dfrac{\\text{useful output}}{\\text{total input}} \\times 100\\%$`, `$\\dfrac{${(inp * pc) / 100}}{${inp}} \\times 100 = ${pc}\\%$`], { unit: '%' })
}

// ================= Earth & space =================
export const plateMove: Gen = (d) => {
  const r = pick([2, 3, 4, 5, 7, 10])
  const yrs = d === 1 ? pick([100, 1000, 10000]) : pick([1e5, 1e6, 2e6, 5e6])
  if (d === 1) return num(`A tectonic plate moves ${r} cm per year. How far does it move in ${yrs.toLocaleString('en-AU')} years, in metres?`, (r * yrs) / 100, [`${r} × ${yrs.toLocaleString('en-AU')} = ${(r * yrs).toLocaleString('en-AU')} cm`, `÷ 100 = ${((r * yrs) / 100).toLocaleString('en-AU')} m`], { unit: 'm' })
  return num(`Australia moves north about ${r} cm per year. How far does it move in ${yrs.toLocaleString('en-AU')} years, in kilometres?`, (r * yrs) / 100000, [`${r} cm × ${yrs.toLocaleString('en-AU')} = ${(r * yrs).toLocaleString('en-AU')} cm`, `1 km = 100 000 cm → ${((r * yrs) / 100000).toLocaleString('en-AU')} km`], { unit: 'km', hint: 'cm → m ÷ 100, m → km ÷ 1000.' })
}

export const lightTravel: Gen = (d) => {
  const objs = [['the Moon', 384000], ['the Sun', 150000000], ['Mars (at its closest)', 55000000], ['Jupiter', 630000000]] as const
  const [o, km] = d === 1 ? objs[pick([0, 1])] : pick(objs)
  const t = (km * 1000) / 3e8
  return num(`Light travels at 300 000 km per second. ${o} is about ${km.toLocaleString('en-AU')} km away. How long does its light take to reach us, in seconds? (nearest whole second)`, Math.round(t), [`$t = \\dfrac{d}{v} = \\dfrac{${km.toLocaleString('en-AU').replace(/,/g, '\\,')}}{300\\,000}$`, `$t \\approx ${Math.round(t)}$ s${t > 120 ? ` — about ${Math.round(t / 60)} minutes. We see it as it was, not as it is now!` : ''}`], { unit: 's', tol: Math.max(1, t * 0.01) })
}

// ================= Science skills =================
export const trialMean: Gen = (d) => {
  const base = ri(20, 80) / 10
  const trials = Array.from({ length: d === 1 ? 3 : 4 }, () => round(base + ri(-3, 3) / 10, 1))
  const out = d >= 2 ? round(base * pick([1.8, 2.2, 0.4]), 1) : null
  const shown = out === null ? trials : [...trials.slice(0, 2), out, ...trials.slice(2)]
  const mean = trials.reduce((a, b) => a + b, 0) / trials.length
  return num(`A student times a ball rolling down a ramp: ${shown.join(' s, ')} s. ${out !== null ? 'Ignoring the outlier, what' : 'What'} is the average time (2 decimal places)?`, round(mean, 2), [
    ...(out !== null ? [`${out} s is an **outlier** — far from the others — so leave it out (and ideally repeat that trial).`] : []),
    `Mean = (${trials.join(' + ')}) ÷ ${trials.length} = ${f2(mean)} s`,
  ], { unit: 's', tol: 0.011, hint: out !== null ? 'Spot the result that doesn’t fit first.' : 'Add them up and divide by how many.' })
}

export const graphGradient: Gen = () => {
  const m = pick([0.5, 1, 1.5, 2, 2.5, 3])
  const xs = [0, 2, 4, 6, 8]
  const fig: Fig = { type: 'plot', series: [{ pts: xs.map((x) => [x, m * x] as [number, number]) }], xLabel: 'mass added (kg)', yLabel: 'spring stretch (cm)', xMax: 8, yMax: Math.ceil((m * 8) / 4) * 4, xStep: 2, yStep: m * 8 > 12 ? 4 : 2, dots: true }
  const x = pick([3, 5, 7])
  return num(`Use the line of best fit to predict the stretch for ${x} kg (an **interpolation**).`, m * x, [`The line goes up ${m * 2} cm for every 2 kg → ${m} cm per kg.`, `${x} kg × ${m} = ${tx(m * x)} cm`], { unit: 'cm', tol: 0.26, fig })
}
