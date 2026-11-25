import { motion } from 'motion/react'
import type { SceneDef } from '.'
import { C, T, Show, Draw, Pill, Arrow, Emo, Pulse, Orbit } from './kit'

type Pt = [number, number]
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

// ---------------- Plate tectonics ----------------
function Tectonics({ step }: { step: number }) {
  return (
    <g>
      <Show when={step === 0}>
        <circle cx={320} cy={340} r={300} fill="#a1887f" />
        <circle cx={320} cy={340} r={286} fill="#ff9f43" />
        <circle cx={320} cy={340} r={170} fill="#ffcc33" />
        <circle cx={320} cy={340} r={85} fill="#fff1b8" />
        {([['crust (thin, rocky)', 38, '#6d4c41'], ['mantle (slowly flowing rock)', 120, '#c96a00'], ['outer core (liquid)', 205, '#b38600'], ['inner core (solid)', 285, '#8a6d00']] as const).map(([t, y, c]) => (
          <text key={t} x={320} y={y + 10} fontSize={16} fontWeight={800} fill={c} textAnchor="middle">{t}</text>
        ))}
      </Show>
      <Show when={step === 1}>
        <rect x={40} y={190} width={560} height={150} fill="#ffb066" />
        <motion.rect x={40} y={150} width={270} height={40} rx={4} fill="#8d6e63" animate={{ x: [40, 30, 40] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.rect x={330} y={150} width={270} height={40} rx={4} fill="#a1887f" animate={{ x: [330, 340, 330] }} transition={{ duration: 4, repeat: Infinity }} />
        {[0, 1].map((side) => {
          const cx = side ? 460 : 180
          const loop: Pt[] = side ? [[330, 320], [330, 210], [580, 210], [580, 320], [330, 320]] : [[310, 320], [310, 210], [60, 210], [60, 320], [310, 320]]
          return <g key={side}>{[0, 1.5, 3].map((d) => <Pulse key={d} pts={loop} color="#d84315" r={6} dur={4.5} delay={d} />)}<text x={cx} y={270} fontSize={14} fontWeight={700} fill="#8a3b00" textAnchor="middle">convection current</text></g>
        })}
        <T x={175} y={130} size={15} weight={700}>plate</T>
        <T x={465} y={130} size={15} weight={700}>plate</T>
        <T x={320} y={40} size={17} weight={700}>plates ride on the slowly churning mantle</T>
      </Show>
      <Show when={step === 2}>
        <rect x={40} y={210} width={560} height={130} fill="#ffb066" />
        <motion.rect x={40} y={170} width={250} height={40} fill="#8d6e63" animate={{ x: [40, 20] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.rect x={350} y={170} width={250} height={40} fill="#8d6e63" animate={{ x: [350, 370] }} transition={{ duration: 3, repeat: Infinity }} />
        <path d="M300 330 Q 310 250 320 172 Q 330 250 340 330 Z" fill="#e53935" />
        {[0, 0.6, 1.2].map((d) => (
          <Pulse key={d} pts={[[320, 320], [320, 180]]} color="#ffeb3b" r={5} dur={1.8} delay={d} />
        ))}
        <Arrow x1={240} y1={140} x2={140} y2={140} color={C.ink} width={4} />
        <Arrow x1={400} y1={140} x2={500} y2={140} color={C.ink} width={4} />
        <T x={320} y={60} size={20} weight={800}>divergent: moving apart</T>
        <T x={320} y={100} size={14} color={C.soft}>magma rises → new crust (mid-ocean ridge)</T>
      </Show>
      <Show when={step === 3}>
        <rect x={40} y={230} width={560} height={110} fill="#ffb066" />
        <path d="M40 180 L330 180 L560 300 L540 320 L320 210 L40 210 Z" fill="#5d6d7e" />
        <path d="M330 150 L600 150 L600 210 L360 210 Z" fill="#a1887f" />
        <path d="M440 150 L470 96 L500 150 Z" fill="#6d4c41" />
        <motion.path d="M470 96 Q 460 70 480 50" stroke="#e53935" strokeWidth={6} fill="none" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} />
        <Arrow x1={120} y1={140} x2={220} y2={140} color={C.ink} width={4} />
        <Arrow x1={590} y1={120} x2={520} y2={120} color={C.ink} width={4} />
        <T x={170} y={250} size={14} color="white" weight={700}>ocean plate sinks (subduction)</T>
        <T x={300} y={60} size={20} weight={800}>convergent: moving together</T>
        <T x={470} y={36} size={13} color={C.coral} weight={700}>volcano</T>
      </Show>
      <Show when={step >= 4}>
        <motion.g animate={{ x: [0, -4, 4, -3, 0] }} transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.6 }}>
          <motion.rect x={60} y={80} width={520} height={110} fill="#a1887f" animate={{ x: [60, 20, 60] }} transition={{ duration: 5, repeat: Infinity }} />
          <motion.rect x={60} y={194} width={520} height={110} fill="#8d6e63" animate={{ x: [60, 100, 60] }} transition={{ duration: 5, repeat: Infinity }} />
          <line x1={40} y1={192} x2={600} y2={192} stroke="#3e2723" strokeWidth={4} strokeDasharray="12 6" />
        </motion.g>
        <Arrow x1={400} y1={135} x2={240} y2={135} color="white" width={5} />
        <Arrow x1={240} y1={250} x2={400} y2={250} color="white" width={5} />
        <T x={320} y={40} size={20} weight={800}>transform: sliding past</T>
        <T x={320} y={336} size={15} color={C.coral} weight={700}>they stick, then slip → earthquake!</T>
      </Show>
    </g>
  )
}

export const tectonics: SceneDef = {
  id: 'tectonics',
  title: 'Plate tectonics',
  steps: [
    'Earth has layers: a thin rocky crust, a thick mantle of hot rock that flows very slowly, a liquid outer core and a solid inner core.',
    'The crust is broken into huge plates that ride on the mantle. Convection currents in the mantle move them a few centimetres every year.',
    'Where plates move apart, magma rises to fill the gap and makes new crust — like at mid-ocean ridges.',
    'Where plates move together, a dense ocean plate can sink under another, feeding volcanoes. Two continents colliding crumple up into mountains.',
    'Where plates slide past each other, they stick, build up stress, and then suddenly slip — causing earthquakes.',
  ],
  Comp: Tectonics,
}

// ---------------- Universe ----------------
function Universe({ step }: { step: number }) {
  const dots = Array.from({ length: 14 }, (_, i) => [rnd(i) * 2 - 1, rnd(i + 30) * 2 - 1] as Pt).filter(([x, y]) => x * x + y * y < 0.8)
  return (
    <g>
      <rect x={0} y={0} width={640} height={360} fill="#0f0b2e" />
      {Array.from({ length: 60 }, (_, i) => (
        <circle key={i} cx={rnd(i + 200) * 640} cy={rnd(i + 400) * 360} r={rnd(i + 600) * 1.6 + 0.4} fill="white" opacity={0.6} />
      ))}
      <Show when={step === 0}>
        <motion.circle cx={320} cy={180} fill="#fff6d5" animate={{ r: [4, 160], opacity: [1, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
        <circle cx={320} cy={180} r={10} fill="#ffe680" />
        <T x={320} y={320} size={18} weight={700} color="white">13.8 billion years ago</T>
      </Show>
      <Show when={step === 1}>
        <motion.g animate={{ scale: [0.4, 1.1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeOut' }}>
          <circle cx={320} cy={180} r={140} fill="#ff6b9a" opacity={0.35} stroke="#ff9ac0" strokeWidth={3} />
          {dots.map(([x, y], i) => (
            <text key={i} x={320 + x * 120} y={180 + y * 120} fontSize={20} textAnchor="middle" dominantBaseline="middle">🌀</text>
          ))}
        </motion.g>
        <T x={320} y={340} size={15} color="white">every galaxy moves away from every other</T>
      </Show>
      <Show when={step === 2}>
        <defs>
          <linearGradient id="spec" x1="0" x2="1">
            {['#6a1fd1', '#3a5bff', '#1fb5ff', '#2ad46a', '#ffe23a', '#ff8a1f', '#ff2a2a'].map((c, i) => (
              <stop key={c} offset={i / 6} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
        <rect x={90} y={90} width={460} height={50} fill="url(#spec)" />
        <rect x={90} y={220} width={460} height={50} fill="url(#spec)" />
        {[170, 260, 330, 420].map((x) => (
          <g key={x}>
            <rect x={x} y={90} width={5} height={50} fill="#111" />
            <motion.rect y={220} width={5} height={50} fill="#111" initial={{ x }} animate={step === 2 ? { x: x + 60 } : { x }} transition={{ duration: 2, delay: 0.5 }} />
          </g>
        ))}
        <T x={320} y={70} size={15} color="white">light from a lab on Earth</T>
        <T x={320} y={300} size={15} color="white">light from a distant galaxy: shifted towards red</T>
        <Arrow x1={420} y1={190} x2={540} y2={190} color="#ff6b6b" width={4} delay={0.6} />
        <T x={480} y={176} size={13} color="#ff9a9a">red shift</T>
      </Show>
      <Show when={step === 3}>
        <Orbit cx={220} cy={180} r={120} dur={30}>
          {Array.from({ length: 140 }, (_, i) => {
            const arm = i % 2
            const t = (i / 140) * 3.2
            const r = 12 + t * 34
            const a = t * 2.2 + arm * Math.PI
            return <circle key={i} cx={220 + r * Math.cos(a) + (rnd(i) - 0.5) * 10} cy={180 + r * Math.sin(a) * 0.55 + (rnd(i + 9) - 0.5) * 8} r={rnd(i + 3) * 2 + 1} fill={arm ? '#c7d2ff' : '#ffe4c4'} />
          })}
        </Orbit>
        <circle cx={220} cy={180} r={14} fill="#fff1c1" />
        <T x={220} y={330} size={15} color="white">a galaxy: billions of stars</T>
        <Emo x={490} y={140} e="⭐" size={70} />
        <T x={490} y={220} size={16} color="#ffe680" weight={700}>fusion: H + H → He</T>
        <T x={490} y={246} size={13} color="#c7c3e6">+ huge amounts of energy</T>
      </Show>
      <Show when={step >= 4}>
        {Array.from({ length: 260 }, (_, i) => (
          <circle key={i} cx={rnd(i + 900) * 640} cy={rnd(i + 1300) * 360} r={14} fill={['#3a5bff', '#6aa8ff', '#ffb36b', '#ff8a5c'][Math.floor(rnd(i + 1700) * 4)]} opacity={0.35} />
        ))}
        <rect x={110} y={140} width={420} height={80} rx={20} fill="#0f0b2ecc" />
        <T x={320} y={170} size={18} color="white" weight={800}>cosmic microwave background</T>
        <T x={320} y={198} size={14} color="#c7c3e6">the afterglow of the Big Bang, from every direction</T>
      </Show>
    </g>
  )
}

export const universe: SceneDef = {
  id: 'universe',
  title: 'The Big Bang & the universe',
  steps: [
    'About 13.8 billion years ago, the universe began in an extremely hot, dense state. We call this the Big Bang.',
    'Since then, space itself has been expanding. Like dots on an inflating balloon, every galaxy moves away from every other.',
    'Light from distant galaxies is stretched to longer, redder wavelengths. This red shift is evidence that they’re moving away — and the furthest ones move fastest.',
    'Over time, gravity pulled gas together into stars and galaxies. Stars shine by fusing hydrogen into helium, releasing huge amounts of energy.',
    'The faint afterglow of the Big Bang still fills space in every direction. It’s called the cosmic microwave background, and it’s strong evidence for the theory.',
  ],
  Comp: Universe,
}

// ---------------- Climate ----------------
function Co2({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x - 13} cy={y} r={6} fill="#ff6b6b" />
      <circle cx={x} cy={y} r={7} fill="#444" />
      <circle cx={x + 13} cy={y} r={6} fill="#ff6b6b" />
    </g>
  )
}
function Climate({ step }: { step: number }) {
  const ground = 'M0 300 Q 320 250 640 300 L640 360 L0 360 Z'
  return (
    <g>
      <Show when={step <= 2}>
        <path d="M0 150 Q 320 100 640 150" fill="none" stroke="#9fd3ff" strokeWidth={46} opacity={0.35} />
        <path d={ground} fill="#7cc576" />
        <Emo x={70} y={50} e="☀️" size={60} />
        {[0, 1, 2].map((i) => (
          <Arrow key={i} x1={110 + i * 20} y1={70 + i * 10} x2={220 + i * 90} y2={270 - i * 4} color={C.sun} width={4} delay={i * 0.2} />
        ))}
        <Show when={step >= 1}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <Arrow x1={370 + i * 58} y1={262} x2={380 + i * 58} y2={150} color={C.coral} width={3} delay={i * 0.2} />
              {i < (step >= 2 ? 4 : 2) && <Arrow x1={392 + i * 58} y1={150} x2={402 + i * 58} y2={256} color="#ff9a9a" width={3} delay={0.8 + i * 0.2} />}
            </g>
          ))}
          {[[120, 140], [300, 120], [520, 140]].map(([x, y], i) => (
            <Co2 key={i} x={x} y={y} />
          ))}
          <T x={250} y={180} size={14} color={C.ink} weight={700}>greenhouse gases</T>
          <T x={470} y={95} size={13} color={C.coral}>infrared sent back</T>
        </Show>
        <Show when={step === 2}>
          {[[200, 150], [380, 110], [450, 160], [80, 120], [600, 125], [260, 105]].map(([x, y], i) => (
            <Co2 key={i} x={x} y={y} />
          ))}
          <Emo x={580} y={230} e="🌡️" size={44} />
          <T x={580} y={278} size={15} color={C.coral} weight={800}>warmer!</T>
          <Emo x={120} y={250} e="🏭" size={44} />
        </Show>
      </Show>
      <Show when={step === 3}>
        <line x1={80} y1={300} x2={580} y2={300} stroke={C.soft} strokeWidth={2} />
        <line x1={80} y1={60} x2={80} y2={300} stroke={C.soft} strokeWidth={2} />
        <Draw d="M80 260 C 250 258 380 240 450 200 C 500 170 540 120 580 80" color={C.coral} width={4} show={step === 3} />
        <T x={110} y={244} size={14} weight={700} anchor="start">280 ppm (1850)</T>
        <T x={560} y={66} size={14} weight={700}>420+ ppm today</T>
        <T x={330} y={330} size={14} color={C.soft}>year →</T>
        <text x={44} y={180} fontSize={13} fill={C.soft} textAnchor="middle" transform="rotate(-90 44 180)">CO₂ in the air</text>
      </Show>
      <Show when={step >= 4}>
        {([['☀️', 'solar power'], ['💨', 'wind power'], ['🌳', 'protect forests'], ['🚲', 'cleaner transport']] as const).map(([e, n], i) => (
          <g key={n}>
            <Emo x={95 + i * 150} y={160} e={e} size={60} delay={i * 0.3} />
            <T x={95 + i * 150} y={230} size={15} weight={700} delay={i * 0.3}>{n}</T>
          </g>
        ))}
        <T x={320} y={70} size={20} weight={800}>cutting emissions</T>
      </Show>
    </g>
  )
}

export const climate: SceneDef = {
  id: 'climate',
  title: 'Global systems & climate change',
  steps: [
    'Sunlight passes through the atmosphere and warms the Earth’s surface.',
    'The warm surface gives off infrared radiation. Greenhouse gases like carbon dioxide absorb some of it and send it back down, keeping Earth warm enough for life.',
    'Burning fossil fuels and clearing forests adds extra carbon dioxide, so more heat is trapped. This enhanced greenhouse effect is warming the planet.',
    'Carbon dioxide in the air has risen from about 280 parts per million before industry to over 420 today, and global temperatures have climbed with it.',
    'Solar and wind power, protecting forests and cleaner transport all help to reduce emissions.',
  ],
  Comp: Climate,
}

// ---------------- Experiments & fair tests ----------------
function Beaker({ x, label }: { x: number; label?: string }) {
  return (
    <g>
      <path d={`M${x - 50} 150 L${x - 50} 280 Q${x - 50} 296 ${x - 34} 296 L${x + 34} 296 Q${x + 50} 296 ${x + 50} 280 L${x + 50} 150`} fill="none" stroke={C.soft} strokeWidth={3.5} />
      <rect x={x - 47} y={190} width={94} height={104} rx={12} fill={C.skySoft} />
      <rect x={x - 12} y={262} width={24} height={24} rx={3} fill="white" stroke="#d0d0dc" />
      {label && <text x={x} y={320} fontSize={14} textAnchor="middle" fill={C.soft}>{label}</text>}
    </g>
  )
}
function Inquiry({ step }: { step: number }) {
  const xs = [160, 320, 480]
  return (
    <g>
      <Show when={step <= 3}>
        {xs.map((x) => (
          <Beaker key={x} x={x} />
        ))}
        <T x={320} y={40} size={18} weight={700} show={step === 0}>Does water temperature affect how fast sugar dissolves?</T>
        <Show when={step >= 1}>
          {['20 °C', '40 °C', '60 °C'].map((t, i) => (
            <g key={t}>
              <Emo x={xs[i] - 70} y={120} e="🌡️" size={30} />
              <text x={xs[i]} y={126} fontSize={18} fontWeight={800} fill={C.coral} textAnchor="middle">{t}</text>
            </g>
          ))}
          <Pill x={320} y={50} text="independent variable: what you CHANGE" color={C.coral} size={15} />
        </Show>
        <Show when={step >= 2}>
          {['90 s', '55 s', '30 s'].map((t, i) => (
            <g key={t}>
              <text x={xs[i]} y={330} fontSize={18} fontWeight={800} fill={C.sky} textAnchor="middle">⏱ {t}</text>
            </g>
          ))}
          <Pill x={320} y={90} text="dependent variable: what you MEASURE" color={C.sky} size={15} />
        </Show>
        <Show when={step === 3}>
          <rect x={60} y={20} width={520} height={110} rx={16} fill="white" stroke={C.mint} strokeWidth={3} />
          <T x={320} y={46} size={16} weight={800} color={C.mint}>controlled variables: keep the SAME</T>
          <T x={320} y={76} size={15}>✓ same mass of sugar   ✓ same volume of water</T>
          <T x={320} y={104} size={15}>✓ same stirring   ✓ same type of sugar</T>
        </Show>
      </Show>
      <Show when={step >= 4}>
        {['Trial 1', 'Trial 2', 'Trial 3', 'Mean'].map((h, i) => (
          <text key={h} x={200 + i * 110} y={90} fontSize={15} fontWeight={800} textAnchor="middle" fill={C.ink}>{h}</text>
        ))}
        <text x={90} y={140} fontSize={15} fontWeight={700} fill={C.coral}>20 °C</text>
        {['88 s', '92 s', '150 s', '90 s'].map((v, i) => (
          <g key={i}>
            <rect x={155 + i * 110} y={112} width={90} height={42} rx={8} fill={i === 3 ? C.mintSoft : i === 2 ? C.coralSoft : '#f4f2fb'} />
            <text x={200 + i * 110} y={140} fontSize={17} fontWeight={700} textAnchor="middle" fill={C.ink}>{v}</text>
          </g>
        ))}
        <line x1={385} y1={120} x2={455} y2={146} stroke={C.coral} strokeWidth={3} />
        <T x={400} y={206} size={14} color={C.coral} weight={700}>outlier — leave it out & repeat</T>
        <T x={530} y={176} size={13} color={C.mint} weight={700}>(88 + 92) ÷ 2</T>
        <Pill x={320} y={270} text="repeat trials → reliable results" color={C.violet} size={16} />
      </Show>
    </g>
  )
}

export const inquiry: SceneDef = {
  id: 'inquiry',
  title: 'Experiments & fair tests',
  steps: [
    'A fair test changes just one thing at a time. Let’s test whether water temperature affects how fast sugar dissolves.',
    'The independent variable is what you change on purpose: the water temperature — 20, 40 and 60 degrees.',
    'The dependent variable is what you measure: the time for the sugar to dissolve.',
    'Controlled variables are everything you keep the same: the mass of sugar, the volume of water, the stirring and the type of sugar.',
    'Repeat each trial and calculate the mean. Repeats make your results reliable and help you spot an outlier, like this 150 seconds.',
  ],
  Comp: Inquiry,
}

// ---------------- Data & graphs ----------------
function Data({ step }: { step: number }) {
  const px = (t: number) => 90 + t * 6
  const py = (s: number) => 300 - s * 1.9
  const pts: Pt[] = [[10, 110], [20, 93], [30, 77], [40, 63], [50, 50], [60, 41], [70, 31]]
  return (
    <g>
      <Show when={step <= 3}>
        <line x1={90} y1={300} x2={560} y2={300} stroke={C.ink} strokeWidth={2.5} />
        <line x1={90} y1={300} x2={90} y2={60} stroke={C.ink} strokeWidth={2.5} />
        {[0, 20, 40, 60, 80].map((t) => (
          <text key={t} x={px(t)} y={320} fontSize={12} fill={C.soft} textAnchor="middle">{t}</text>
        ))}
        {[0, 40, 80, 120].map((s) => (
          <text key={s} x={80} y={py(s) + 4} fontSize={12} fill={C.soft} textAnchor="end">{s}</text>
        ))}
        <T x={325} y={346} size={14} weight={700} color={C.coral}>water temperature (°C) — independent</T>
        <text x={34} y={180} fontSize={14} fontWeight={700} fill={C.sky} textAnchor="middle" transform="rotate(-90 34 180)">time to dissolve (s) — dependent</text>
        {pts.map(([t, s], i) => (
          <circle key={i} cx={px(t)} cy={py(s)} r={step >= 1 ? 6 : 0} fill={C.violet} stroke="white" strokeWidth={2} style={{ transition: `r 0.4s ${i * 0.25}s` }} />
        ))}
        <Draw d={`M${px(5)} ${py(118)} C ${px(30)} ${py(70)} ${px(50)} ${py(48)} ${px(75)} ${py(27)}`} color={C.mint} width={4} show={step >= 2} />
        <Show when={step === 2}>
          <path d={`M${px(10)} ${py(110)} L${px(20)} ${py(93)} L${px(30)} ${py(77)} L${px(40)} ${py(63)}`} fill="none" stroke={C.coral} strokeWidth={2} strokeDasharray="4 4" />
          <T x={470} y={90} size={15} color={C.mint} weight={700}>✓ smooth line of best fit</T>
          <T x={470} y={116} size={15} color={C.coral} weight={700}>✗ don’t join the dots</T>
        </Show>
        <Show when={step === 3}>
          <circle cx={px(35)} cy={py(105)} r={6} fill={C.coral} />
          <circle cx={px(35)} cy={py(105)} r={16} fill="none" stroke={C.coral} strokeWidth={2.5} />
          <T x={px(35) + 56} y={py(105)} size={14} color={C.coral} weight={700}>outlier?</T>
          <T x={470} y={80} size={16} weight={800}>trend:</T>
          <T x={470} y={104} size={15}>as temperature ↑,</T>
          <T x={470} y={126} size={15}>dissolving time ↓</T>
        </Show>
      </Show>
      <Show when={step >= 4}>
        <Emo x={320} y={80} e="☀️" size={60} />
        <Emo x={170} y={260} e="🍦" size={60} />
        <Emo x={470} y={260} e="🥵" size={60} />
        <Arrow x1={290} y1={110} x2={200} y2={220} color={C.ink} width={3} />
        <Arrow x1={350} y1={110} x2={440} y2={220} color={C.ink} width={3} />
        <line x1={215} y1={260} x2={425} y2={260} stroke={C.coral} strokeWidth={3} strokeDasharray="8 6" />
        <T x={320} y={248} size={14} color={C.coral} weight={700}>correlated…</T>
        <T x={320} y={290} size={14} color={C.coral} weight={700}>…but one doesn’t cause the other</T>
        <T x={320} y={336} size={15} color={C.soft}>hot weather causes both</T>
      </Show>
    </g>
  )
}

export const data: SceneDef = {
  id: 'data',
  title: 'Data, graphs & conclusions',
  steps: [
    'Put the independent variable — what you changed — on the x-axis, and the dependent variable — what you measured — on the y-axis. Label both with units.',
    'Plot each result carefully as a point.',
    'Draw a line of best fit: a smooth line or curve through the middle of the points, with points scattered evenly either side. Don’t join the dots!',
    'Describe the trend: as the temperature increases, the dissolving time decreases. A point far from the line might be an outlier worth repeating.',
    'Be careful: correlation isn’t always causation. Ice-cream sales and sunburn rise together, but hot weather causes both.',
  ],
  Comp: Data,
}
