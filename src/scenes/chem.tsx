import { motion } from 'motion/react'
import type { SceneDef } from '.'
import { C, T, Show, Draw, Pill, Arrow, Emo, Pulse, Orbit, Box } from './kit'

type Pt = [number, number]

/** pseudo-random but stable numbers */
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}
function Nucleus({ x, y, p, n, r = 9 }: { x: number; y: number; p: number; n: number; r?: number }) {
  const parts = Array.from({ length: p + n }, (_, k) => ({ k, proton: k % 2 === 0 ? k / 2 < p : (k - 1) / 2 >= n }))
  // interleave protons and neutrons in a sunflower spiral
  let pc = 0
  let nc = 0
  return (
    <g>
      {parts.map(({ k }) => {
        const isP = (k % 2 === 0 && pc < p) || nc >= n
        if (isP) pc++
        else nc++
        const a = k * 2.4
        const d = r * 0.95 * Math.sqrt(k)
        return <circle key={k} cx={x + d * Math.cos(a)} cy={y + d * Math.sin(a)} r={r} fill={isP ? C.coral : '#b8b5c8'} stroke="white" strokeWidth={1.5} />
      })}
    </g>
  )
}
function Shell({ cx, cy, r, e, dur, show = true }: { cx: number; cy: number; r: number; e: number; dur: number; show?: boolean }) {
  return (
    <Show when={show}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.line} strokeWidth={2.5} />
      <Orbit cx={cx} cy={cy} r={r} dur={dur}>
        {Array.from({ length: e }, (_, i) => {
          const a = (i / e) * Math.PI * 2
          return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={7} fill={C.sky} stroke="white" strokeWidth={2} />
        })}
      </Orbit>
    </Show>
  )
}

// ---------------- Atoms ----------------
function Atoms({ step }: { step: number }) {
  const [cx, cy] = [220, 180]
  return (
    <g>
      <Show when={step <= 3}>
        <Shell cx={cx} cy={cy} r={62} e={2} dur={4} show={step >= 2} />
        <Shell cx={cx} cy={cy} r={100} e={8} dur={9} show={step >= 2} />
        <Shell cx={cx} cy={cy} r={138} e={1} dur={12} show={step >= 2} />
        <Show when={step === 0}>
          <motion.circle cx={cx} cy={cy} r={14} fill={C.coral} animate={{ r: [12, 16, 12] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <T x={460} y={150} size={20} weight={700}>a tiny, dense nucleus</T>
          <T x={460} y={180} size={15} color={C.soft}>almost all the mass</T>
          <T x={460} y={204} size={15} color={C.soft}>the rest is mostly empty space</T>
        </Show>
        <Show when={step >= 1}>
          <Nucleus x={cx} y={cy} p={11} n={12} r={7} />
        </Show>
        <Show when={step >= 1}>
          <circle cx={440} cy={80} r={10} fill={C.coral} />
          <text x={460} y={86} fontSize={17} fontWeight={600} fill={C.ink}>proton (+1)</text>
          <circle cx={440} cy={116} r={10} fill="#b8b5c8" />
          <text x={460} y={122} fontSize={17} fontWeight={600} fill={C.ink}>neutron (0)</text>
        </Show>
        <Show when={step >= 2}>
          <circle cx={440} cy={152} r={8} fill={C.sky} />
          <text x={460} y={158} fontSize={17} fontWeight={600} fill={C.ink}>electron (−1)</text>
        </Show>
        <Show when={step === 3}>
          <text x={470} y={250} fontSize={54} fontWeight={800} fill={C.violet}>Na</text>
          <text x={448} y={220} fontSize={20} fontWeight={700} fill={C.ink} textAnchor="end">23</text>
          <text x={448} y={258} fontSize={20} fontWeight={700} fill={C.coral} textAnchor="end">11</text>
          <text x={470} y={290} fontSize={15} fill={C.soft}>11 p · 12 n · 11 e</text>
          <text x={470} y={316} fontSize={15} fill={C.sky} fontWeight={700}>shells: 2, 8, 1</text>
        </Show>
      </Show>
      <Show when={step >= 4}>
        <Nucleus x={180} y={170} p={6} n={6} r={11} />
        <Nucleus x={460} y={170} p={6} n={8} r={11} />
        <T x={180} y={262} size={22} weight={800}>carbon-12</T>
        <T x={180} y={290} size={15} color={C.soft}>6 protons · 6 neutrons</T>
        <T x={460} y={262} size={22} weight={800}>carbon-14</T>
        <T x={460} y={290} size={15} color={C.soft}>6 protons · 8 neutrons</T>
        <Pill x={320} y={50} text="isotopes: same protons, different neutrons" color={C.violet} size={15} />
      </Show>
    </g>
  )
}

export const atoms: SceneDef = {
  id: 'atoms',
  title: 'Atoms & isotopes',
  steps: [
    'Everything is made of atoms. At the centre of each atom is a tiny, dense nucleus — it holds almost all the mass.',
    'The nucleus contains protons, which are positive, and neutrons, which have no charge.',
    'Negative electrons move in shells around the nucleus. The first shell holds 2 electrons, the next holds 8.',
    'This is sodium. Its atomic number is 11, so it has 11 protons and 11 electrons, arranged 2, 8, 1. Its mass number is 23, so it has 23 minus 11, which is 12 neutrons.',
    'Isotopes are atoms of the same element with different numbers of neutrons — like carbon-12 and carbon-14. Both have 6 protons.',
  ],
  Comp: Atoms,
}

// ---------------- Radioactivity ----------------
function Radioactivity({ step }: { step: number }) {
  const lanes = [
    { y: 100, sym: 'α', name: 'alpha', stop: 252, col: C.coral, show: step >= 1 },
    { y: 185, sym: 'β', name: 'beta', stop: 382, col: C.sky, show: step >= 2 },
    { y: 270, sym: 'γ', name: 'gamma', stop: 512, col: C.violet, show: step >= 3 },
  ]
  return (
    <g>
      <Show when={step === 0}>
        <motion.g animate={{ scale: [1, 1.06, 0.96, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
          <Nucleus x={320} y={180} p={14} n={18} r={10} />
        </motion.g>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2
          return <Pulse key={i} pts={[[320 + 70 * Math.cos(a), 180 + 70 * Math.sin(a)], [320 + 170 * Math.cos(a), 180 + 170 * Math.sin(a)]]} color={C.sun} r={5} dur={1.2} delay={i * 0.2} />
        })}
        <T x={320} y={340} size={16} color={C.soft}>an unstable nucleus gives out radiation</T>
      </Show>
      <Show when={step >= 1 && step <= 3}>
        <rect x={40} y={60} width={60} height={240} rx={12} fill={C.sunSoft} stroke={C.sun} strokeWidth={3} />
        <Emo x={70} y={180} e="☢️" size={36} />
        <rect x={250} y={60} width={6} height={250} fill="#f4efe3" stroke="#c9bfa8" />
        <rect x={380} y={60} width={14} height={250} fill="#d8dde6" stroke="#9aa3b5" />
        <rect x={510} y={60} width={34} height={250} fill="#5c6270" stroke="#3b3f48" />
        <text x={253} y={330} fontSize={13} fill={C.soft} textAnchor="middle">paper</text>
        <text x={387} y={330} fontSize={13} fill={C.soft} textAnchor="middle">aluminium</text>
        <text x={527} y={330} fontSize={13} fill={C.soft} textAnchor="middle">thick lead</text>
        {lanes.map((l) => (
          <g key={l.sym}>
            <Show when={l.show}>
              <text x={125} y={l.y - 18} fontSize={20} fontWeight={800} fill={l.col}>{l.sym}</text>
              <line x1={100} y1={l.y} x2={l.stop} y2={l.y} stroke={l.col} strokeWidth={2} strokeDasharray="4 6" opacity={0.4} />
            </Show>
            <Pulse pts={[[102, l.y], [l.stop - 4, l.y]]} show={l.show} color={l.col} r={l.sym === 'α' ? 10 : l.sym === 'β' ? 5 : 4} dur={l.sym === 'γ' ? 1 : 1.4} />
          </g>
        ))}
        <T x={180} y={128} size={13} color={C.coral} show={step >= 1}>2 protons + 2 neutrons</T>
        <T x={310} y={213} size={13} color={C.sky} show={step >= 2}>fast electron</T>
        <T x={440} y={298} size={13} color={C.violet} show={step >= 3}>energy wave</T>
      </Show>
      <Show when={step >= 4}>
        {Array.from({ length: 16 }, (_, i) => {
          const at = i >= 8 ? 1 : i >= 4 ? 2 : i >= 2 ? 3 : 99
          return (
            <motion.circle key={i} cx={70 + (i % 4) * 44} cy={90 + Math.floor(i / 4) * 44} r={16} initial={false} animate={step >= 4 ? { fill: [C.coral, C.coral, '#d5d2e0'] } : { fill: C.coral }} transition={{ duration: at * 1.6, times: [0, 0.95, 1], delay: 0.2 }} stroke="white" strokeWidth={2} />
          )
        })}
        <text x={136} y={290} fontSize={14} fill={C.soft} textAnchor="middle">16 → 8 → 4 → 2</text>
        <line x1={300} y1={300} x2={600} y2={300} stroke={C.soft} strokeWidth={2} />
        <line x1={300} y1={60} x2={300} y2={300} stroke={C.soft} strokeWidth={2} />
        <Draw d={Array.from({ length: 61 }, (_, i) => `${i ? 'L' : 'M'}${300 + i * 5} ${300 - 220 * Math.pow(0.5, i / 15)}`).join(' ')} color={C.coral} width={4} show={step >= 4} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <circle cx={300 + k * 75} cy={300 - 220 * Math.pow(0.5, k)} r={6} fill={C.violet} />
            <text x={308 + k * 75} y={292 - 220 * Math.pow(0.5, k)} fontSize={13} fontWeight={700} fill={C.violet}>{[100, 50, 25, 12.5][k]}%</text>
          </g>
        ))}
        <text x={450} y={326} fontSize={13} fill={C.soft} textAnchor="middle">time (in half-lives) →</text>
      </Show>
    </g>
  )
}

export const radioactivity: SceneDef = {
  id: 'radioactivity',
  title: 'Radioactivity & half-life',
  steps: [
    'Some nuclei are unstable. To become more stable, they give out radiation. This is radioactive decay.',
    'Alpha particles are two protons and two neutrons. They are big and slow, so a sheet of paper stops them.',
    'Beta particles are fast electrons thrown out of the nucleus. A few millimetres of aluminium stops them.',
    'Gamma rays are waves of energy. They pass through paper and aluminium, and need thick lead or concrete to reduce them.',
    'Half-life is the time for half the radioactive nuclei to decay. After each half-life the amount halves: 100, 50, 25, then 12 and a half percent.',
  ],
  Comp: Radioactivity,
}

// ---------------- Reactions ----------------
function Atom({ x, y, h, label }: { x: number; y: number; h: boolean; label?: string }) {
  return (
    <motion.g initial={false} animate={{ x, y }} transition={{ duration: 1.4, ease: 'easeInOut' }}>
      <circle r={h ? 15 : 22} fill={h ? 'white' : '#ff5a5a'} stroke={h ? '#9aa3b5' : '#c43c3c'} strokeWidth={2.5} />
      <text y={h ? 5 : 7} fontSize={h ? 14 : 18} fontWeight={800} fill={h ? C.ink : 'white'} textAnchor="middle">{label ?? (h ? 'H' : 'O')}</text>
    </motion.g>
  )
}
function Reactions({ step }: { step: number }) {
  const after = step >= 2
  const H: [Pt, Pt][] = [
    [[120, 110], [390, 132]],
    [[148, 110], [450, 132]],
    [[120, 250], [390, 262]],
    [[148, 250], [450, 262]],
  ]
  const O: [Pt, Pt][] = [
    [[250, 180], [420, 110]],
    [[290, 180], [420, 240]],
  ]
  return (
    <g>
      <Show when={step <= 3}>
        {H.map(([a, b], i) => <Atom key={'h' + i} x={after ? b[0] : a[0]} y={after ? b[1] : a[1]} h />)}
        {O.map(([a, b], i) => <Atom key={'o' + i} x={after ? b[0] : a[0]} y={after ? b[1] : a[1]} h={false} />)}
        <T x={180} y={40} size={18} weight={700} show={step >= 1}>2H₂ + O₂</T>
        <T x={420} y={40} size={18} weight={700} show={after}>→ 2H₂O</T>
        <T x={320} y={320} size={16} color={C.soft} show={step === 0}>bonds break, atoms rearrange, new bonds form</T>
        <T x={320} y={320} size={16} color={C.soft} show={step === 2}>4 H and 2 O before · 4 H and 2 O after</T>
        <Show when={step === 3}>
          <line x1={150} y1={330} x2={490} y2={330} stroke={C.ink} strokeWidth={4} />
          <path d="M320 330 L300 352 L340 352 Z" fill={C.ink} />
          <T x={190} y={312} size={14}>reactants: 36 g</T>
          <T x={450} y={312} size={14}>products: 36 g</T>
          <Pill x={190} y={190} text="mass is conserved" color={C.mint} size={15} />
        </Show>
      </Show>
      <Show when={step >= 4}>
        {([['🫧', 'gas bubbles'], ['🎨', 'colour change'], ['🌫️', 'precipitate'], ['🌡️', 'temperature change']] as const).map(([e, n], i) => (
          <g key={n}>
            <Emo x={95 + i * 150} y={160} e={e} size={60} delay={i * 0.3} />
            <T x={95 + i * 150} y={230} size={16} weight={700} delay={i * 0.3}>{n}</T>
          </g>
        ))}
        <T x={320} y={60} size={20} weight={800}>signs of a chemical reaction</T>
      </Show>
    </g>
  )
}

export const reactions: SceneDef = {
  id: 'reactions',
  title: 'Chemical reactions & equations',
  steps: [
    'In a chemical reaction, bonds break, atoms rearrange, and new bonds form to make new substances.',
    'Here’s hydrogen reacting with oxygen: two hydrogen molecules and one oxygen molecule.',
    'The atoms rearrange into two water molecules. Count them: four hydrogen and two oxygen atoms before, and the same after.',
    'Atoms are never created or destroyed, so the total mass stays the same. That’s why chemical equations must be balanced.',
    'Signs that a chemical reaction is happening include gas bubbles, a colour change, a precipitate forming, or a change in temperature.',
  ],
  Comp: Reactions,
}

// ---------------- Acids & bases ----------------
const PH_COL = ['#e8202a', '#ee4a22', '#f37a20', '#f7a51f', '#f9cf22', '#e3df2b', '#a8d23a', '#4caf50', '#2aa37a', '#1d9aa8', '#2479c2', '#3657b3', '#5a3ea6', '#6d2c96', '#6a1f7a']
function Acids({ step }: { step: number }) {
  const px = (ph: number) => 52 + ph * 36 + 18
  const marks: [number, string][] = [[2, 'lemon'], [3, 'vinegar'], [7, 'water'], [9, 'bicarb soda'], [10, 'soap'], [13, 'drain cleaner']]
  return (
    <g>
      <Show when={step <= 2}>
        {PH_COL.map((c, i) => (
          <g key={i}>
            <rect x={52 + i * 36} y={160} width={36} height={50} fill={c} />
            <text x={px(i)} y={232} fontSize={15} fontWeight={700} fill={C.ink} textAnchor="middle">{i}</text>
          </g>
        ))}
        <T x={140} y={270} size={18} color="#e8202a" weight={800}>acidic</T>
        <T x={px(7)} y={270} size={18} color="#4caf50" weight={800}>neutral</T>
        <T x={500} y={270} size={18} color="#5a3ea6" weight={800}>basic (alkaline)</T>
        <Show when={step === 1}>
          {marks.map(([ph, n], i) => (
            <g key={n}>
              <path d={`M${px(ph)} 156 l-7 -12 l14 0 z`} fill={C.ink} />
              <text x={px(ph)} y={i % 2 ? 110 : 132} fontSize={14} fontWeight={700} fill={C.ink} textAnchor="middle">{n}</text>
            </g>
          ))}
        </Show>
        <Show when={step === 2}>
          {[2, 3].map((ph) => (
            <g key={ph}>
              <path d={`M${px(ph)} 150 Q ${px(ph) + 18} 110 ${px(ph + 1)} 150`} fill="none" stroke={C.coral} strokeWidth={3} />
              <text x={px(ph) + 18} y={110} fontSize={15} fontWeight={800} fill={C.coral} textAnchor="middle">×10</text>
            </g>
          ))}
          <T x={320} y={320} size={17} weight={700}>pH 2 is 10 × 10 = 100 times more acidic than pH 4</T>
        </Show>
      </Show>
      <Show when={step >= 3}>
        <path d="M230 90 L230 300 Q230 320 250 320 L390 320 Q410 320 410 300 L410 90" fill="none" stroke={C.soft} strokeWidth={4} />
        <motion.rect x={233} y={160} width={174} height={157} rx={14} initial={false} animate={{ fill: step >= 3 ? ['#e8202a', '#f7a51f', '#4caf50'] : '#e8202a' }} transition={{ duration: 3, delay: 0.5 }} />
        <motion.g initial={false} animate={step >= 3 ? { y: [0, 30, 0] } : {}} transition={{ duration: 1.5, repeat: 1 }}>
          <rect x={312} y={20} width={16} height={70} rx={6} fill="#e1ecff" stroke={C.sky} strokeWidth={2.5} />
        </motion.g>
        <T x={110} y={180} size={17} color="#e8202a" weight={700}>acid</T>
        <T x={530} y={60} size={17} color="#5a3ea6" weight={700}>+ base</T>
        <T x={530} y={230} size={17} color="#4caf50" weight={700}>→ salt + water</T>
        <Show when={step >= 4}>
          <Pill x={510} y={342} text="HCl + NaOH → NaCl + H₂O" color={C.violet} size={14} />
          <Emo x={590} y={285} e="🧂" size={36} />
        </Show>
      </Show>
    </g>
  )
}

export const acids: SceneDef = {
  id: 'acids',
  title: 'Acids, bases & pH',
  steps: [
    'The pH scale runs from 0 to 14. Below 7 is acidic, 7 is neutral, and above 7 is basic, or alkaline.',
    'Lemon juice and vinegar are acids. Bicarbonate soda, soap and drain cleaner are bases. Pure water is neutral.',
    'Each step on the scale is ten times stronger. So pH 2 is ten times ten — a hundred times — more acidic than pH 4.',
    'Add a base to an acid and they neutralise each other. Universal indicator changes from red to green as the solution becomes neutral.',
    'Acid plus base makes a salt and water. Hydrochloric acid plus sodium hydroxide makes sodium chloride — table salt — and water.',
  ],
  Comp: Acids,
}

// ---------------- Periodic table ----------------
const PT: [string, number, number, string][] = [
  // symbol, column (0-7), row, type
  ['H', 0, 0, 'n'], ['He', 7, 0, 'g'],
  ['Li', 0, 1, 'm'], ['Be', 1, 1, 'm'], ['B', 2, 1, 'd'], ['C', 3, 1, 'n'], ['N', 4, 1, 'n'], ['O', 5, 1, 'n'], ['F', 6, 1, 'n'], ['Ne', 7, 1, 'g'],
  ['Na', 0, 2, 'm'], ['Mg', 1, 2, 'm'], ['Al', 2, 2, 'm'], ['Si', 3, 2, 'd'], ['P', 4, 2, 'n'], ['S', 5, 2, 'n'], ['Cl', 6, 2, 'n'], ['Ar', 7, 2, 'g'],
  ['K', 0, 3, 'm'], ['Ca', 1, 3, 'm'],
]
const TYPE_COL: Record<string, string> = { m: '#dbe8ff', n: '#ffe1e6', d: '#fff1c2', g: '#ece3ff' }
function Periodic({ step }: { step: number }) {
  const [x0, y0, s] = [40, 70, 54]
  const groups = ['1', '2', '13', '14', '15', '16', '17', '18']
  return (
    <g>
      {groups.map((g, i) => (
        <text key={g} x={x0 + i * s + s / 2} y={y0 - 10} fontSize={13} fontWeight={700} fill={C.soft} textAnchor="middle">{g}</text>
      ))}
      {[1, 2, 3, 4].map((p, i) => (
        <text key={p} x={x0 - 12} y={y0 + i * s + s / 2 + 5} fontSize={13} fontWeight={700} fill={C.soft} textAnchor="middle">{p}</text>
      ))}
      {PT.map(([sym, c, r, t]) => {
        const hl = (step === 2 || step === 3) && c === 0 && sym !== 'H' ? C.coral : step >= 4 && c === 7 ? C.violet : null
        return (
          <g key={sym}>
            <motion.rect x={x0 + c * s + 2} y={y0 + r * s + 2} width={s - 4} height={s - 4} rx={8} initial={false} animate={{ fill: step >= 1 ? TYPE_COL[t] : '#ffffff' }} stroke={hl ?? '#d9d4ea'} strokeWidth={hl ? 4 : 1.5} />
            <text x={x0 + c * s + s / 2} y={y0 + r * s + s / 2 + 7} fontSize={19} fontWeight={800} fill={C.ink} textAnchor="middle">{sym}</text>
          </g>
        )
      })}
      <T x={250} y={32} size={14} color={C.soft} show={step === 0}>groups (columns) →</T>
      <text x={14} y={200} fontSize={14} fill={C.soft} textAnchor="middle" transform="rotate(-90 14 200)" opacity={step === 0 ? 1 : 0}>periods (rows) →</text>
      <Show when={step === 1}>
        {([['m', 'metals'], ['n', 'non-metals'], ['d', 'metalloids'], ['g', 'noble gases']] as const).map(([t, n], i) => (
          <g key={t}>
            <rect x={490} y={90 + i * 40} width={26} height={26} rx={6} fill={TYPE_COL[t]} stroke="#cfc8e6" />
            <text x={526} y={109 + i * 40} fontSize={16} fontWeight={600} fill={C.ink}>{n}</text>
          </g>
        ))}
      </Show>
      <Show when={step === 2 || step === 3}>
        {(['Li  2, 1', 'Na  2, 8, 1', 'K  2, 8, 8, 1'] as const).map((t, i) => (
          <text key={t} x={490} y={140 + i * 40} fontSize={17} fontWeight={700} fill={C.coral}>{t}</text>
        ))}
        <T x={555} y={96} size={15} weight={700} color={C.ink}>1 outer electron</T>
        <Show when={step === 3}>
          <Arrow x1={20 + 0} y1={140} x2={20} y2={260} color={C.coral} width={4} />
          <T x={555} y={290} size={16} weight={800} color={C.coral}>more reactive ↓</T>
        </Show>
      </Show>
      <Show when={step >= 4}>
        <T x={555} y={130} size={17} weight={800} color={C.violet}>noble gases</T>
        <T x={555} y={160} size={15} color={C.soft}>full outer shell</T>
        <T x={555} y={184} size={15} color={C.soft}>→ unreactive</T>
      </Show>
    </g>
  )
}

export const periodic: SceneDef = {
  id: 'periodic',
  title: 'The periodic table',
  steps: [
    'The periodic table arranges the elements in order of atomic number. The rows are called periods, and the columns are called groups.',
    'Metals are on the left, non-metals on the right, and metalloids like boron and silicon sit along the staircase between them. Noble gases are in the last column.',
    'Elements in the same group have the same number of outer-shell electrons. Lithium, sodium and potassium each have just one — so they react in similar ways.',
    'These group 1 alkali metals become more reactive as you go down the group, because the outer electron is further from the nucleus and easier to lose.',
    'Group 18, the noble gases, already have a full outer shell. That’s why they hardly react at all.',
  ],
  Comp: Periodic,
}

// ---------------- Bonding ----------------
function Bonding({ step }: { step: number }) {
  const na: Pt = [170, 180]
  const cl: Pt = [450, 180]
  const outer = 60
  const clElectrons = Array.from({ length: 7 }, (_, i) => (i / 8) * Math.PI * 2 + Math.PI / 8)
  const gapAngle = Math.PI + Math.PI / 8 + (7 / 8) * Math.PI * 2 - Math.PI * 2
  return (
    <g>
      <Show when={step <= 2}>
        {[na, cl].map(([x, y], k) => (
          <g key={k}>
            {[22, 40, outer].map((r) => (
              <circle key={r} cx={x} cy={y} r={r} fill="none" stroke={C.line} strokeWidth={2} />
            ))}
            <circle cx={x} cy={y} r={14} fill={k ? '#c6f0d0' : '#ffe0b8'} stroke={k ? '#3fa34d' : C.sun} strokeWidth={2} />
            <text x={x} y={y + 5} fontSize={13} fontWeight={800} textAnchor="middle" fill={C.ink}>{k ? 'Cl' : 'Na'}</text>
          </g>
        ))}
        {clElectrons.map((a, i) => (
          <circle key={i} cx={cl[0] + outer * Math.cos(a)} cy={cl[1] + outer * Math.sin(a)} r={6} fill={C.sky} />
        ))}
        <motion.circle r={7} fill={C.coral} stroke="white" strokeWidth={2} initial={false} animate={step >= 1 ? { cx: cl[0] + outer * Math.cos(gapAngle), cy: cl[1] + outer * Math.sin(gapAngle) } : { cx: na[0] + outer, cy: na[1] }} transition={{ duration: 1.6, delay: step === 1 ? 0.5 : 0 }} />
        <T x={170} y={290} size={15} color={C.soft} show={step === 0}>Na: 2, 8, 1</T>
        <T x={450} y={290} size={15} color={C.soft} show={step === 0}>Cl: 2, 8, 7</T>
        <T x={310} y={120} size={15} color={C.coral} show={step === 1} delay={0.6}>electron transferred</T>
        <Show when={step === 2}>
          <T x={170} y={290} size={26} weight={800} color={C.sun}>Na⁺</T>
          <T x={450} y={290} size={26} weight={800} color="#3fa34d">Cl⁻</T>
          <T x={310} y={60} size={18} weight={700}>opposite charges attract → ionic bond</T>
        </Show>
      </Show>
      <Show when={step === 3}>
        <circle cx={320} cy={170} r={70} fill="#ffe1e1" stroke="#ff5a5a" strokeWidth={3} opacity={0.9} />
        <circle cx={230} cy={250} r={42} fill="#f2f4f8" stroke="#9aa3b5" strokeWidth={3} opacity={0.9} />
        <circle cx={410} cy={250} r={42} fill="#f2f4f8" stroke="#9aa3b5" strokeWidth={3} opacity={0.9} />
        {[[262, 218], [272, 230], [378, 218], [368, 230]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6} fill={C.sky} />
        ))}
        <text x={320} y={176} fontSize={22} fontWeight={800} textAnchor="middle" fill="#c43c3c">O</text>
        <text x={222} y={262} fontSize={18} fontWeight={800} textAnchor="middle" fill={C.ink}>H</text>
        <text x={418} y={262} fontSize={18} fontWeight={800} textAnchor="middle" fill={C.ink}>H</text>
        <T x={320} y={330} size={17} weight={700}>covalent bonds: shared pairs of electrons</T>
      </Show>
      <Show when={step >= 4}>
        {Array.from({ length: 15 }, (_, i) => (
          <g key={i}>
            <circle cx={140 + (i % 5) * 90} cy={100 + Math.floor(i / 5) * 80} r={24} fill="#dbe8ff" stroke={C.sky} strokeWidth={2.5} />
            <text x={140 + (i % 5) * 90} y={107 + Math.floor(i / 5) * 80} fontSize={20} fontWeight={800} textAnchor="middle" fill={C.sky}>+</text>
          </g>
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <Pulse key={i} pts={[[100 + rnd(i) * 440, 70 + rnd(i + 20) * 200], [100 + rnd(i + 40) * 440, 70 + rnd(i + 60) * 200], [100 + rnd(i + 80) * 440, 70 + rnd(i + 99) * 200], [100 + rnd(i) * 440, 70 + rnd(i + 20) * 200]]} color={C.coral} r={5} dur={4 + rnd(i) * 3} />
        ))}
        <T x={320} y={340} size={16} weight={700}>metallic: positive ions in a sea of free electrons</T>
      </Show>
    </g>
  )
}

export const bonding: SceneDef = {
  id: 'bonding',
  title: 'Chemical bonding',
  steps: [
    'Atoms bond so that they end up with a full outer shell of electrons. Sodium has one outer electron; chlorine has seven.',
    'In ionic bonding, a metal gives electrons to a non-metal. Sodium hands its one outer electron to chlorine.',
    'Now sodium is a positive ion and chloride is a negative ion. Opposite charges attract strongly — that’s an ionic bond.',
    'In covalent bonding, non-metal atoms share pairs of electrons. In water, oxygen shares a pair with each hydrogen atom.',
    'In metals, positive ions sit in a sea of free electrons. Those moving electrons are why metals conduct electricity.',
  ],
  Comp: Bonding,
}

// ---------------- Rates of reaction ----------------
function Particles({ n, dur, hot }: { n: number; dur: number; hot: boolean }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const pts: Pt[] = Array.from({ length: 6 }, (_, k) => [80 + rnd(i * 7 + k) * 280, 80 + rnd(i * 13 + k + 50) * 200])
        return <Pulse key={i} pts={[...pts, pts[0]]} color={i % 2 ? C.sky : hot ? C.coral : C.sun} r={9} dur={dur + rnd(i) * dur * 0.3} />
      })}
    </g>
  )
}
function Rates({ step }: { step: number }) {
  return (
    <g>
      <Show when={step <= 2}>
        <rect x={60} y={60} width={320} height={240} rx={16} fill="#fbfaff" stroke={C.soft} strokeWidth={3} />
        <Show when={step === 0}>
          <Particles n={8} dur={7} hot={false} />
        </Show>
        <Show when={step === 1}>
          <Particles n={8} dur={2.2} hot />
        </Show>
        <Show when={step === 2}>
          <Particles n={18} dur={7} hot={false} />
        </Show>
        <T x={510} y={120} size={20} weight={800} show={step === 0}>collision theory</T>
        <T x={510} y={152} size={15} color={C.soft} show={step === 0}>collide with enough energy</T>
        <T x={510} y={120} size={20} weight={800} color={C.coral} show={step === 1}>higher temperature</T>
        <T x={510} y={152} size={15} color={C.soft} show={step === 1}>faster, harder collisions</T>
        <T x={510} y={120} size={20} weight={800} color={C.sky} show={step === 2}>higher concentration</T>
        <T x={510} y={152} size={15} color={C.soft} show={step === 2}>more particles → more collisions</T>
      </Show>
      <Show when={step === 3}>
        <rect x={100} y={130} width={110} height={110} fill={C.violetSoft} stroke={C.violet} strokeWidth={3} />
        <T x={155} y={280} size={16}>one lump</T>
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i} x={340 + (i % 4) * 62} y={140 + Math.floor(i / 4) * 62} w={48} h={48} fill={C.violetSoft} stroke={C.coral} delay={i * 0.1} />
        ))}
        <T x={460} y={280} size={16}>small pieces: more surface exposed</T>
        <Arrow x1={230} y1={185} x2={315} y2={185} color={C.ink} />
      </Show>
      <Show when={step >= 4}>
        <line x1={70} y1={310} x2={590} y2={310} stroke={C.soft} strokeWidth={2} />
        <line x1={70} y1={50} x2={70} y2={310} stroke={C.soft} strokeWidth={2} />
        <Draw d="M90 230 L180 230 C 260 230 270 80 330 80 C 390 80 400 270 470 270 L570 270" color={C.coral} width={4} show={step >= 4} />
        <Draw d="M180 230 C 260 230 270 160 330 160 C 390 160 400 270 470 270" color={C.mint} width={4} dash="9 7" show={step >= 4} delay={0.8} />
        <Arrow x1={140} y1={226} x2={140} y2={84} color={C.coral} width={3} />
        <line x1={130} y1={80} x2={330} y2={80} stroke={C.coral} strokeDasharray="4 4" />
        <T x={150} y={150} size={14} color={C.coral} anchor="start">activation energy</T>
        <T x={430} y={150} size={15} color={C.mint} weight={700} delay={0.8}>with a catalyst</T>
        <T x={120} y={252} size={13} color={C.soft}>reactants</T>
        <T x={530} y={292} size={13} color={C.soft}>products</T>
      </Show>
    </g>
  )
}

export const rates: SceneDef = {
  id: 'rates',
  title: 'Rates of reaction',
  steps: [
    'Particles can only react when they collide with enough energy. This is collision theory.',
    'Heat them up and they move faster. They collide more often, and harder — so the reaction speeds up.',
    'Increase the concentration and there are more particles crowded into the same space, so there are more collisions every second.',
    'Break a solid into smaller pieces and you expose much more surface for particles to collide with.',
    'A catalyst gives the reaction an easier path with lower activation energy, so more collisions succeed. And the catalyst isn’t used up.',
  ],
  Comp: Rates,
}
