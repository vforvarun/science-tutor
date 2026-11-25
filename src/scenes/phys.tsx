import { motion } from 'motion/react'
import type { SceneDef } from '.'
import { C, T, Show, Draw, Pill, Arrow, Emo, Pulse, Box } from './kit'

type Pt = [number, number]
const wavePath = (x0: number, x1: number, y: number, A: number, lam: number, phase = 0) =>
  Array.from({ length: Math.round((x1 - x0) / 4) + 1 }, (_, i) => `${i ? 'L' : 'M'}${x0 + i * 4} ${(y - A * Math.sin(((i * 4) / lam) * 2 * Math.PI + phase)).toFixed(1)}`).join(' ')

// ---------------- Heat transfer ----------------
function Heat({ step }: { step: number }) {
  return (
    <g>
      <Show when={step === 0}>
        <rect x={90} y={120} width={140} height={120} rx={16} fill="#ff8a80" />
        <rect x={410} y={120} width={140} height={120} rx={16} fill="#8ab4ff" />
        <T x={160} y={180} size={22} weight={800} color="white">HOT</T>
        <T x={480} y={180} size={22} weight={800} color="white">COLD</T>
        <Arrow x1={245} y1={180} x2={395} y2={180} color={C.coral} width={6} />
        <T x={320} y={150} size={16} color={C.coral} weight={700}>heat</T>
        <T x={320} y={300} size={16} color={C.soft}>always from hotter to colder</T>
      </Show>
      <Show when={step === 1}>
        <defs>
          <linearGradient id="rod" x1="0" x2="1">
            <stop offset="0" stopColor="#ff6b6b" />
            <stop offset="1" stopColor="#9db8e8" />
          </linearGradient>
        </defs>
        <rect x={110} y={160} width={420} height={44} rx={10} fill="url(#rod)" />
        {Array.from({ length: 12 }, (_, i) => {
          const x = 128 + i * 35
          const a = 7 - i * 0.55
          return <motion.circle key={i} cy={182} r={8} fill="white" stroke={C.ink} strokeWidth={1.5} initial={{ cx: x }} animate={{ cx: [x - a, x + a, x - a] }} transition={{ duration: 0.35, repeat: Infinity }} />
        })}
        <Emo x={110} y={240} e="🔥" size={46} />
        <T x={320} y={110} size={22} weight={800}>conduction</T>
        <T x={320} y={290} size={15} color={C.soft}>vibrating particles pass energy along — best in metals</T>
      </Show>
      <Show when={step === 2}>
        <rect x={200} y={110} width={240} height={190} rx={10} fill={C.skySoft} stroke={C.soft} strokeWidth={3} />
        <Emo x={320} y={330} e="🔥" size={40} />
        {[0, 1].map((side) => {
          const s = side ? 1 : -1
          const loop: Pt[] = [[320, 280], [320, 140], [320 + s * 90, 140], [320 + s * 90, 280], [320, 280]]
          return [0, 1.2, 2.4].map((d) => <Pulse key={side + '-' + d} pts={loop} color={C.coral} r={7} dur={3.6} delay={d} />)
        })}
        <Arrow x1={320} y1={260} x2={320} y2={160} color={C.coral} width={4} />
        <Arrow x1={240} y1={160} x2={240} y2={260} color={C.sky} width={4} />
        <Arrow x1={400} y1={160} x2={400} y2={260} color={C.sky} width={4} />
        <T x={320} y={80} size={22} weight={800}>convection</T>
        <T x={520} y={170} size={14} color={C.coral}>warm water rises</T>
        <T x={520} y={240} size={14} color={C.sky}>cool water sinks</T>
      </Show>
      <Show when={step === 3}>
        <Emo x={100} y={180} e="☀️" size={90} />
        {[140, 180, 220].map((y, i) => (
          <Draw key={y} d={wavePath(170, 460, y, 10, 40)} color={C.coral} width={3} show={step === 3} delay={i * 0.3} />
        ))}
        <Emo x={530} y={180} e="🌍" size={90} />
        <T x={320} y={80} size={22} weight={800}>radiation</T>
        <T x={320} y={300} size={15} color={C.soft}>infrared waves cross empty space</T>
      </Show>
      <Show when={step >= 4}>
        <rect x={250} y={70} width={140} height={250} rx={24} fill="#d8dde6" stroke={C.soft} strokeWidth={3} />
        <rect x={266} y={86} width={108} height={218} rx={16} fill="white" stroke="#b6bdcc" strokeWidth={2} strokeDasharray="5 4" />
        <rect x={280} y={100} width={80} height={190} rx={10} fill="#ffcf8a" stroke="#c9c9c9" strokeWidth={4} />
        <rect x={290} y={50} width={60} height={36} rx={8} fill="#8b5e3c" />
        <T x={420} y={66} size={15} anchor="start" color={C.ink}>stopper: stops convection</T>
        <T x={460} y={180} size={15} anchor="start" color={C.ink}>vacuum: no particles,</T>
        <T x={460} y={202} size={15} anchor="start" color={C.ink}>so no conduction</T>
        <T x={160} y={150} size={15} anchor="end" color={C.ink}>shiny walls</T>
        <T x={160} y={172} size={15} anchor="end" color={C.ink}>reflect radiation</T>
        <Arrow x1={170} y1={160} x2={272} y2={160} color={C.ink} width={2} />
        <Arrow x1={455} y1={190} x2={372} y2={190} color={C.ink} width={2} />
        <Arrow x1={414} y1={66} x2={356} y2={66} color={C.ink} width={2} />
      </Show>
    </g>
  )
}

export const heat: SceneDef = {
  id: 'heat',
  title: 'Heat transfer',
  steps: [
    'Heat is energy moving from a hotter place to a colder one. It travels in three ways.',
    'Conduction: in a solid, vibrating particles pass energy on to their neighbours. Metals are the best conductors.',
    'Convection: in liquids and gases, warm fluid becomes less dense and rises, while cooler fluid sinks — making a convection current.',
    'Radiation: infrared waves carry energy, even across empty space. That’s how the Sun warms the Earth.',
    'A vacuum flask stops all three: a stopper blocks convection, the vacuum stops conduction, and shiny walls reflect radiation.',
  ],
  Comp: Heat,
}

// ---------------- Waves ----------------
function Waves({ step }: { step: number }) {
  return (
    <g>
      <Show when={step <= 2}>
        <defs>
          <clipPath id="wclip">
            <rect x={40} y={40} width={560} height={280} />
          </clipPath>
        </defs>
        <g clipPath="url(#wclip)">
          <motion.path d={wavePath(-160, 640, 180, 50, 160)} fill="none" stroke={C.violet} strokeWidth={4} animate={step === 0 ? { x: [0, 160] } : { x: 0 }} transition={step === 0 ? { duration: 2, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }} />
        </g>
        <motion.g animate={step === 0 ? { y: [0, -50, 0, 50, 0] } : { y: 0 }} transition={step === 0 ? { duration: 2, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}>
          <Emo x={320} y={166} e="🦆" size={36} show={step === 0} />
        </motion.g>
        <line x1={40} y1={180} x2={600} y2={180} stroke={C.line} strokeWidth={2} strokeDasharray="6 6" />
        <T x={320} y={330} size={15} color={C.soft} show={step === 0}>the duck bobs up and down — the wave moves on, the water doesn’t</T>
        <Show when={step >= 1}>
          <line x1={40} y1={112} x2={200} y2={112} stroke={C.coral} strokeWidth={3} />
          <line x1={40} y1={102} x2={40} y2={122} stroke={C.coral} strokeWidth={3} />
          <line x1={200} y1={102} x2={200} y2={122} stroke={C.coral} strokeWidth={3} />
          <T x={120} y={92} size={16} color={C.coral} weight={700}>wavelength λ</T>
          <line x1={360} y1={180} x2={360} y2={130} stroke={C.mint} strokeWidth={4} />
          <T x={372} y={112} size={16} color={C.mint} weight={700} anchor="start">amplitude</T>
          <T x={250} y={250} size={14} color={C.soft}>crest ↑ · trough ↓</T>
        </Show>
        <Show when={step === 2}>
          <Pill x={320} y={310} text="speed = frequency × wavelength   v = fλ" color={C.violet} size={15} />
        </Show>
      </Show>
      <Show when={step === 3}>
        {Array.from({ length: 22 }, (_, i) =>
          [0, 1, 2, 3].map((r) => {
            const x = 70 + i * 24
            return <motion.circle key={i + '-' + r} cy={120 + r * 36} r={6} fill={C.sky} initial={{ cx: x }} animate={{ cx: [x - 9, x + 9, x - 9] }} transition={{ duration: 1.2, repeat: Infinity, delay: -i * 0.11 }} />
          }),
        )}
        <Arrow x1={240} y1={290} x2={420} y2={290} color={C.ink} width={3} />
        <T x={330} y={316} size={15} color={C.soft}>direction of travel</T>
        <T x={320} y={70} size={20} weight={800}>sound: a longitudinal wave</T>
        <T x={320} y={340} size={14} color={C.soft}>compressions (squashed) and rarefactions (spread out)</T>
      </Show>
      <Show when={step >= 4}>
        <line x1={60} y1={290} x2={290} y2={290} stroke={C.soft} strokeWidth={6} />
        <line x1={175} y1={290} x2={175} y2={110} stroke={C.soft} strokeWidth={2} strokeDasharray="5 5" />
        <Draw d="M80 140 L175 290" color={C.coral} width={4} show={step >= 4} />
        <Draw d="M175 290 L270 140" color={C.coral} width={4} show={step >= 4} delay={0.8} />
        <T x={175} y={322} size={15} weight={700}>reflection</T>
        <T x={175} y={96} size={13} color={C.soft}>angle in = angle out</T>
        <rect x={360} y={190} width={240} height={120} fill={C.skySoft} stroke={C.sky} strokeWidth={2} />
        <Draw d="M380 70 L470 190" color={C.coral} width={4} show={step >= 4} delay={0.4} />
        <Draw d="M470 190 L510 300" color={C.coral} width={4} show={step >= 4} delay={1.2} />
        <T x={480} y={330} size={15} weight={700}>refraction (bending)</T>
        <T x={560} y={250} size={13} color={C.sky}>water</T>
      </Show>
    </g>
  )
}

export const waves: SceneDef = {
  id: 'waves',
  title: 'Waves: sound & light',
  steps: [
    'Waves carry energy from place to place without carrying matter. Watch the duck: it just bobs up and down as the wave passes.',
    'The wavelength is the distance from one crest to the next. The amplitude is the height from the middle to a crest — bigger amplitude means more energy.',
    'Frequency is how many waves pass each second, measured in hertz. The wave’s speed equals its frequency times its wavelength.',
    'Sound is a longitudinal wave. The particles squash together and spread apart along the direction the sound travels. It needs particles, so it can’t cross a vacuum.',
    'Light reflects off a mirror at the same angle it arrives. It refracts, or bends, when it changes speed going into a new material like water.',
  ],
  Comp: Waves,
}

// ---------------- Electricity ----------------
function Bulb({ x, y, on, broken = false }: { x: number; y: number; on: boolean; broken?: boolean }) {
  return (
    <g>
      <motion.circle cx={x} cy={y} r={22} initial={false} animate={{ fill: on ? '#ffe066' : '#f1f1f4' }} stroke={C.ink} strokeWidth={2.5} />
      <path d={`M${x - 15} ${y - 15} L${x + 15} ${y + 15} M${x + 15} ${y - 15} L${x - 15} ${y + 15}`} stroke={C.ink} strokeWidth={2} />
      {broken && <text x={x + 26} y={y - 18} fontSize={22}>💥</text>}
    </g>
  )
}
function Cell({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 22} y={y - 14} width={44} height={28} fill="#fbfaff" />
      <line x1={x - 6} y1={y - 22} x2={x - 6} y2={y + 22} stroke={C.ink} strokeWidth={3} />
      <line x1={x + 6} y1={y - 12} x2={x + 6} y2={y + 12} stroke={C.ink} strokeWidth={7} />
    </g>
  )
}
function Electricity({ step }: { step: number }) {
  const loop: Pt[] = [[120, 80], [520, 80], [520, 280], [120, 280], [120, 80]]
  const parallelBroken = step >= 4
  return (
    <g>
      <Show when={step <= 2}>
        <rect x={120} y={80} width={400} height={200} fill="none" stroke={C.ink} strokeWidth={3} />
        <Cell x={320} y={280} />
        <Bulb x={320} y={80} on />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Pulse key={i} pts={loop} color={C.sky} r={5} dur={6} delay={i} />
        ))}
        <T x={320} y={318} size={15} color={C.soft}>battery</T>
        <Show when={step >= 1}>
          <circle cx={120} cy={180} r={18} fill="white" stroke={C.ink} strokeWidth={2.5} />
          <text x={120} y={186} fontSize={17} fontWeight={800} textAnchor="middle" fill={C.sky}>A</text>
          <T x={58} y={180} size={14} color={C.sky}>current</T>
          <path d="M290 80 L290 30 L350 30 L350 80" fill="none" stroke={C.ink} strokeWidth={2} />
          <circle cx={320} cy={30} r={16} fill="white" stroke={C.ink} strokeWidth={2.5} />
          <text x={320} y={36} fontSize={16} fontWeight={800} textAnchor="middle" fill={C.coral}>V</text>
          <T x={410} y={30} size={14} color={C.coral}>voltage</T>
        </Show>
        <Show when={step === 2}>
          <rect x={508} y={150} width={24} height={60} rx={3} fill="#fff7e0" stroke={C.ink} strokeWidth={2.5} />
          <T x={575} y={180} size={14}>resistor</T>
          <path d="M270 230 L320 140 L370 230 Z" fill={C.violetSoft} stroke={C.violet} strokeWidth={3} />
          <line x1={290} y1={196} x2={350} y2={196} stroke={C.violet} strokeWidth={2} />
          <text x={320} y={186} fontSize={20} fontWeight={800} fill={C.violet} textAnchor="middle">V</text>
          <text x={300} y={222} fontSize={17} fontWeight={800} fill={C.violet} textAnchor="middle">I</text>
          <text x={340} y={222} fontSize={17} fontWeight={800} fill={C.violet} textAnchor="middle">R</text>
        </Show>
      </Show>
      <Show when={step === 3}>
        <rect x={120} y={80} width={400} height={200} fill="none" stroke={C.ink} strokeWidth={3} />
        <Cell x={320} y={280} />
        <motion.g initial={false} animate={{ opacity: 1 }}>
          <Bulb x={240} y={80} on={false} broken />
          <Bulb x={400} y={80} on={false} />
        </motion.g>
        <T x={320} y={40} size={20} weight={800}>series: one path</T>
        <T x={320} y={180} size={15} color={C.soft}>one bulb breaks → the loop is broken</T>
        <T x={320} y={204} size={15} color={C.coral} weight={700}>all the bulbs go out</T>
      </Show>
      <Show when={step >= 4}>
        <path d="M120 80 L120 300 L520 300 L520 80" fill="none" stroke={C.ink} strokeWidth={3} />
        <line x1={120} y1={80} x2={520} y2={80} stroke={C.ink} strokeWidth={3} />
        <line x1={120} y1={190} x2={520} y2={190} stroke={C.ink} strokeWidth={3} />
        <Cell x={320} y={300} />
        <Bulb x={320} y={80} on={false} broken={parallelBroken} />
        <Bulb x={320} y={190} on />
        <Pulse pts={[[120, 300], [120, 190], [520, 190], [520, 300], [120, 300]]} color={C.sky} r={5} dur={4} />
        <Pulse pts={[[120, 300], [120, 190], [520, 190], [520, 300], [120, 300]]} color={C.sky} r={5} dur={4} delay={2} />
        <T x={320} y={40} size={20} weight={800}>parallel: separate branches</T>
        <T x={320} y={240} size={15} color={C.mint} weight={700}>this branch still works!</T>
        <T x={320} y={340} size={14} color={C.soft}>each branch gets the full voltage</T>
      </Show>
    </g>
  )
}

export const electricity: SceneDef = {
  id: 'electricity',
  title: 'Electric circuits',
  steps: [
    'A circuit needs a complete loop and a source of energy, like a battery. Charge flows all the way round and lights the bulb.',
    'Current is the flow of charge, measured in amps with an ammeter in series. Voltage is the push from the battery, measured in volts with a voltmeter across the component.',
    'Resistance opposes the current, measured in ohms. Ohm’s law links them: voltage equals current times resistance. Cover the one you want in the triangle.',
    'In a series circuit there’s only one path. The current is the same everywhere — and if one bulb breaks, they all go out.',
    'In a parallel circuit each branch is its own loop and gets the full voltage. If one bulb breaks, the others stay on. That’s how houses are wired.',
  ],
  Comp: Electricity,
}

// ---------------- Motion ----------------
function Car({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-34} y={-22} width={68} height={22} rx={8} fill={C.coral} />
      <rect x={-18} y={-36} width={38} height={18} rx={6} fill={C.coral} />
      <rect x={-12} y={-32} width={13} height={11} rx={2} fill="#dff2ff" />
      <rect x={4} y={-32} width={12} height={11} rx={2} fill="#dff2ff" />
      <circle cx={-18} cy={0} r={9} fill={C.ink} />
      <circle cx={20} cy={0} r={9} fill={C.ink} />
    </g>
  )
}
function Motion({ step }: { step: number }) {
  const g = { x0: 90, y0: 300, w: 460, h: 220 }
  return (
    <g>
      <Show when={step <= 1}>
        <line x1={40} y1={250} x2={600} y2={250} stroke={C.soft} strokeWidth={6} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <line x1={80 + i * 90} y1={250} x2={80 + i * 90} y2={266} stroke={C.ink} strokeWidth={2} />
            <text x={80 + i * 90} y={290} fontSize={14} fontWeight={700} textAnchor="middle" fill={C.ink}>{i * 20} m</text>
            <Show when={step === 1}>
              <text x={80 + i * 90} y={312} fontSize={13} textAnchor="middle" fill={C.sky}>{i} s</text>
            </Show>
          </g>
        ))}
        <motion.g animate={{ x: [0, 450] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
          <Car x={80} y={241} />
        </motion.g>
        <Pill x={320} y={80} text="speed = distance ÷ time" color={C.violet} size={16} />
        <T x={320} y={130} size={17} weight={700} show={step === 1}>20 m every second → 20 m/s</T>
      </Show>
      <Show when={step === 2}>
        <line x1={g.x0} y1={g.y0} x2={g.x0 + g.w} y2={g.y0} stroke={C.soft} strokeWidth={2} />
        <line x1={g.x0} y1={g.y0} x2={g.x0} y2={g.y0 - g.h} stroke={C.soft} strokeWidth={2} />
        <Draw d="M90 300 L210 160 L330 160 L520 110" color={C.violet} width={5} show={step === 2} />
        <T x={130} y={200} size={14} color={C.coral} weight={700}>steep = fast</T>
        <T x={270} y={145} size={14} color={C.soft} weight={700}>flat = stopped</T>
        <T x={440} y={110} size={14} color={C.sky} weight={700}>shallow = slow</T>
        <T x={320} y={330} size={14} color={C.soft}>time →</T>
        <text x={56} y={200} fontSize={14} fill={C.soft} textAnchor="middle" transform="rotate(-90 56 200)">distance</text>
      </Show>
      <Show when={step === 3}>
        <path d="M150 260 A 130 130 0 0 1 410 260" fill="none" stroke={C.line} strokeWidth={18} strokeLinecap="round" />
        {[0, 5, 10, 15, 20].map((v, i) => {
          const a = Math.PI + (i / 4) * Math.PI
          return <text key={v} x={280 + 100 * Math.cos(a)} y={262 + 100 * Math.sin(a)} fontSize={15} fontWeight={700} fill={C.ink} textAnchor="middle">{v}</text>
        })}
        <motion.line x1={280} y1={260} stroke={C.coral} strokeWidth={6} strokeLinecap="round" initial={{ x2: 170, y2: 260 }} animate={step === 3 ? { x2: [170.0, 178.4, 202.2, 237.9, 280.0, 322.1, 357.8, 381.6, 390.0, 390.0], y2: [260.0, 217.9, 182.2, 158.4, 150.0, 158.4, 182.2, 217.9, 260.0, 260.0] } : { x2: 170, y2: 260 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
        <circle cx={280} cy={260} r={10} fill={C.ink} />
        <T x={280} y={300} size={14} color={C.soft}>m/s</T>
        <T x={520} y={140} size={17} weight={700}>0 → 20 m/s in 4 s</T>
        <Pill x={520} y={190} text="a = (v − u) ÷ t" color={C.violet} size={15} />
        <T x={520} y={240} size={17} weight={800} color={C.coral}>= 5 m/s²</T>
      </Show>
      <Show when={step >= 4}>
        <line x1={g.x0} y1={g.y0} x2={g.x0 + g.w} y2={g.y0} stroke={C.soft} strokeWidth={2} />
        <line x1={g.x0} y1={g.y0} x2={g.x0} y2={g.y0 - g.h} stroke={C.soft} strokeWidth={2} />
        <path d="M90 300 L270 120 L520 120 L520 300 Z" fill={C.mint} opacity={0.2} />
        <Draw d="M90 300 L270 120 L520 120" color={C.violet} width={5} show={step >= 4} />
        <T x={150} y={190} size={14} color={C.coral} weight={700}>slope = acceleration</T>
        <T x={400} y={230} size={16} color={C.mint} weight={800}>area = distance</T>
        <T x={320} y={330} size={14} color={C.soft}>time →</T>
        <text x={56} y={200} fontSize={14} fill={C.soft} textAnchor="middle" transform="rotate(-90 56 200)">velocity</text>
      </Show>
    </g>
  )
}

export const motionScene: SceneDef = {
  id: 'motion',
  title: 'Speed, velocity & acceleration',
  steps: [
    'Speed tells you how far something travels each second: distance divided by time.',
    'This car travels 20 metres every second, so its speed is 20 metres per second. Add a direction, and that’s its velocity.',
    'On a distance–time graph, the slope shows the speed. A steeper line is faster, and a flat line means the object has stopped.',
    'Acceleration is how quickly velocity changes. Going from 0 to 20 metres per second in 4 seconds is an acceleration of 5 metres per second squared.',
    'On a velocity–time graph, the slope is the acceleration, and the area under the line is the distance travelled.',
  ],
  Comp: Motion,
}

// ---------------- Forces ----------------
function Rocket() {
  return (
    <g>
      <path d="M320 70 Q 345 100 345 150 L345 220 L295 220 L295 150 Q 295 100 320 70 Z" fill="#eef0f7" stroke={C.ink} strokeWidth={2.5} />
      <circle cx={320} cy={140} r={12} fill={C.skySoft} stroke={C.sky} strokeWidth={3} />
      <path d="M295 190 L272 232 L295 222 Z M345 190 L368 232 L345 222 Z" fill={C.coral} />
      <motion.path d="M302 222 L320 290 L338 222 Z" fill="#ffb347" animate={{ scaleY: [1, 1.25, 1] }} transition={{ duration: 0.25, repeat: Infinity }} style={{ originX: 0.5, originY: 0 }} />
    </g>
  )
}
function Forces({ step }: { step: number }) {
  return (
    <g>
      <Show when={step === 0}>
        <rect x={270} y={140} width={100} height={80} rx={8} fill={C.sunSoft} stroke={C.sun} strokeWidth={3} />
        <Arrow x1={130} y1={180} x2={265} y2={180} color={C.coral} width={6} />
        <Arrow x1={510} y1={180} x2={375} y2={180} color={C.coral} width={6} />
        <T x={190} y={160} size={16} weight={700}>50 N</T>
        <T x={450} y={160} size={16} weight={700}>50 N</T>
        <T x={320} y={280} size={18} weight={700}>balanced: net force = 0 → no change</T>
      </Show>
      <Show when={step === 1}>
        <motion.g animate={step === 1 ? { x: [-150, 60, 60] } : { x: 0 }} transition={{ duration: 3, times: [0, 0.5, 1], repeat: Infinity }}>
          <rect x={180} y={120} width={260} height={120} rx={18} fill="#ffd166" stroke="#d6a400" strokeWidth={3} />
          <circle cx={230} cy={260} r={18} fill={C.ink} />
          <circle cx={390} cy={260} r={18} fill={C.ink} />
          <motion.g style={{ originX: 0.5, originY: 1 }} animate={step === 1 ? { rotate: [0, 0, 28, 0] } : { rotate: 0 }} transition={{ duration: 3, times: [0, 0.5, 0.62, 1], repeat: Infinity }}>
            <line x1={320} y1={220} x2={320} y2={175} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
            <circle cx={320} cy={160} r={15} fill="#ffe8d6" stroke={C.ink} strokeWidth={2.5} />
          </motion.g>
        </motion.g>
        <T x={320} y={60} size={18} weight={700}>the bus stops — you keep going!</T>
        <T x={320} y={320} size={16} color={C.soft}>inertia (first law)</T>
      </Show>
      <Show when={step === 2}>
        <rect x={120} y={110} width={90} height={60} rx={6} fill="none" stroke={C.ink} strokeWidth={3} />
        <rect x={120} y={230} width={90} height={60} rx={6} fill="#c7b8ff" stroke={C.ink} strokeWidth={3} />
        <Emo x={165} y={254} e="🛍️" size={30} />
        <Arrow x1={40} y1={140} x2={115} y2={140} color={C.coral} width={5} />
        <Arrow x1={40} y1={260} x2={115} y2={260} color={C.coral} width={5} />
        <Arrow x1={230} y1={140} x2={430} y2={140} color={C.mint} width={6} delay={0.4} />
        <Arrow x1={230} y1={260} x2={300} y2={260} color={C.mint} width={6} delay={0.4} />
        <T x={330} y={115} size={14} color={C.mint}>big acceleration</T>
        <T x={380} y={262} size={14} color={C.mint}>small acceleration</T>
        <T x={78} y={120} size={13} color={C.coral}>same push</T>
        <Pill x={520} y={200} text="F = ma" color={C.violet} size={22} />
      </Show>
      <Show when={step === 3}>
        <motion.g animate={step === 3 ? { y: [40, -10] } : { y: 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'easeIn' }}>
          <Rocket />
        </motion.g>
        <Arrow x1={440} y1={240} x2={440} y2={90} color={C.mint} width={5} />
        <T x={456} y={150} size={15} color={C.mint} weight={700} anchor="start">gas pushes rocket up</T>
        <Arrow x1={200} y1={130} x2={200} y2={290} color={C.coral} width={5} />
        <T x={186} y={210} size={15} color={C.coral} weight={700} anchor="end">rocket pushes gas down</T>
        <T x={320} y={340} size={15} color={C.soft}>third law: equal and opposite</T>
      </Show>
      <Show when={step >= 4}>
        <Emo x={170} y={110} e="🧑‍🚀" size={56} />
        <Emo x={470} y={110} e="🧑‍🚀" size={56} />
        <rect x={80} y={300} width={180} height={30} rx={10} fill="#8fd3a4" />
        <rect x={380} y={300} width={180} height={30} rx={10} fill="#cfd2dc" />
        <Arrow x1={170} y1={150} x2={170} y2={290} color={C.coral} width={6} />
        <Arrow x1={470} y1={150} x2={470} y2={180} color={C.coral} width={6} />
        <T x={230} y={220} size={15} weight={700} anchor="start">588 N</T>
        <T x={530} y={170} size={15} weight={700} anchor="start">96 N</T>
        <T x={170} y={350} size={14} color={C.soft}>Earth (g = 9.8)</T>
        <T x={470} y={350} size={14} color={C.soft}>Moon (g = 1.6)</T>
        <Pill x={320} y={36} text="mass 60 kg on both · W = mg" color={C.violet} size={15} />
      </Show>
    </g>
  )
}

export const forces: SceneDef = {
  id: 'forces',
  title: 'Forces & Newton’s laws',
  steps: [
    'Forces are pushes and pulls, measured in newtons. When the forces on an object are balanced, its motion doesn’t change.',
    'Newton’s first law: objects keep doing what they’re doing unless a net force acts. When a bus stops suddenly, your body keeps moving forward. That’s inertia.',
    'Newton’s second law: a net force makes an object accelerate. Force equals mass times acceleration, so the same push gives a heavy trolley a smaller acceleration.',
    'Newton’s third law: every action has an equal and opposite reaction. A rocket pushes gas down, and the gas pushes the rocket up.',
    'Weight is the force of gravity on your mass. A 60 kilogram astronaut weighs about 588 newtons on Earth, but only 96 newtons on the Moon. Their mass doesn’t change.',
  ],
  Comp: Forces,
}

// ---------------- Energy ----------------
function Energy({ step }: { step: number }) {
  const track = 'M50 70 C 150 70 220 300 320 300 C 420 300 470 160 590 160'
  const atBottom = step >= 2
  return (
    <g>
      <Show when={step === 0}>
        {(['🔋', '💡'] as const).map((e, i) => (
          <Emo key={e} x={170 + i * 160} y={170} e={e} size={64} delay={i * 0.4} />
        ))}
        <Arrow x1={210} y1={170} x2={285} y2={170} color={C.ink} delay={0.3} />
        <Arrow x1={370} y1={150} x2={460} y2={110} color={C.sun} delay={0.8} />
        <Arrow x1={370} y1={190} x2={460} y2={240} color={C.coral} delay={1} />
        <T x={510} y={100} size={16} color="#b07d00" weight={700}>light</T>
        <T x={510} y={250} size={16} color={C.coral} weight={700}>heat</T>
        <T x={170} y={230} size={14} color={C.soft}>chemical</T>
        <T x={330} y={230} size={14} color={C.soft}>electrical</T>
        <Pill x={320} y={50} text="energy is transformed, never created or destroyed" color={C.violet} size={14} />
      </Show>
      <Show when={step >= 1 && step <= 3}>
        <path d={track} fill="none" stroke={C.soft} strokeWidth={6} />
        <motion.circle r={16} fill={C.coral} stroke="white" strokeWidth={3} initial={false} animate={atBottom ? { cx: [62, 150, 240, 320], cy: [54, 120, 250, 284] } : { cx: 62, cy: 54 }} transition={{ duration: 1.8, delay: atBottom && step === 2 ? 0.4 : 0 }} />
        <rect x={470} y={40} width={150} height={100} rx={12} fill="white" stroke={C.line} />
        <Box x={495} y={atBottom ? 120 : 52} w={36} h={atBottom ? 6 : 74} fill={C.violetSoft} stroke={C.violet} />
        <Box x={560} y={atBottom ? 52 : 120} w={36} h={atBottom ? 74 : 6} fill={C.coralSoft} stroke={C.coral} />
        <text x={513} y={152} fontSize={13} fontWeight={700} textAnchor="middle" fill={C.violet}>Ep</text>
        <text x={578} y={152} fontSize={13} fontWeight={700} textAnchor="middle" fill={C.coral}>Ek</text>
        <Show when={step === 3}>
          <Pill x={300} y={60} text="Ek = ½ m v²" color={C.coral} size={18} />
          <T x={300} y={110} size={15} color={C.soft}>double the speed → 4 × the energy</T>
        </Show>
      </Show>
      <Show when={step >= 4}>
        <path d="M60 140 L330 140 L330 220 L60 220 Z" fill="#ffd8a8" />
        <path d="M330 140 L520 140 L540 160 L520 156 L330 156 Z" fill={C.sun} />
        <path d="M330 156 L380 156 Q 420 156 430 200 L460 320 L380 320 L360 230 Q 350 220 330 220 Z" fill="#ff9e8a" />
        <T x={190} y={182} size={18} weight={800}>100 J in</T>
        <T x={580} y={146} size={15} weight={700} color="#b07d00">20 J light</T>
        <T x={565} y={300} size={15} weight={700} color={C.coral}>80 J heat (wasted)</T>
        <Pill x={250} y={290} text="efficiency = 20 ÷ 100 = 20%" color={C.violet} size={15} />
      </Show>
    </g>
  )
}

export const energy: SceneDef = {
  id: 'energy',
  title: 'Energy & its conservation',
  steps: [
    'Energy can’t be created or destroyed — only changed from one form to another. A torch changes chemical energy into electrical energy, then light and heat.',
    'At the top of a roller-coaster, the car has lots of gravitational potential energy, and hardly any kinetic energy.',
    'As it rolls down, the potential energy turns into kinetic energy. At the bottom it’s moving fastest.',
    'Kinetic energy equals one half m v squared. Because the speed is squared, doubling the speed makes the kinetic energy four times as big.',
    'Real machines waste some energy, mostly as heat. A bulb that turns 100 joules into 20 joules of light is 20 percent efficient. The other 80 joules spreads out as heat.',
  ],
  Comp: Energy,
}
