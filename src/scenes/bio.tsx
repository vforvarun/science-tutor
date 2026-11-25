import { motion } from 'motion/react'
import type { SceneDef } from '.'
import { C, T, Show, Line, Draw, Pill, Arrow, Emo, Pulse, Box } from './kit'

type Pt = [number, number]

// ---------------- Nervous system ----------------
function Nervous({ step }: { step: number }) {
  const sensory: Pt[] = [[112, 214], [200, 178], [300, 170]]
  const relay: Pt[] = [[300, 170], [330, 196]]
  const motor: Pt[] = [[330, 196], [440, 206], [516, 226]]
  const main = step < 5
  return (
    <g>
      <Show when={main}>
        <Pill x={320} y={28} text="Stimulus → Receptor → CNS → Effector → Response" color={C.violet} size={15} />
        <Emo x={315} y={78} e="🧠" size={46} />
        <rect x={300} y={102} width={30} height={200} rx={14} fill={C.violetSoft} stroke={C.violet} strokeWidth={2.5} />
        <text x={315} y={322} fontSize={14} fill={C.soft} textAnchor="middle" fontWeight={600}>spinal cord</text>
        <motion.g initial={false} animate={{ x: step >= 4 ? -48 : 0 }} transition={{ duration: 0.5, delay: step >= 4 ? 1.6 : 0 }}>
          <Emo x={92} y={214} e="✋" size={46} />
          <circle cx={112} cy={214} r={step >= 1 ? 8 : 0} fill={C.sun} stroke="white" strokeWidth={2} />
        </motion.g>
        <Emo x={92} y={292} e="🔥" size={34} />
        <Emo x={548} y={232} e="💪" size={52} />
        <Draw d={`M${sensory.map((p) => p.join(' ')).join(' L')}`} show={step >= 2} color={C.sky} width={5} />
        <Draw d={`M${relay.map((p) => p.join(' ')).join(' L')}`} show={step >= 3} color={C.sun} width={5} />
        <Draw d={`M${motor.map((p) => p.join(' ')).join(' L')}`} show={step >= 3} color={C.mint} width={5} delay={0.3} />
        <T x={118} y={170} size={15} color="#b07d00" show={step >= 1}>receptor</T>
        <T x={196} y={150} size={15} color={C.sky} show={step >= 2}>sensory neuron</T>
        <T x={430} y={180} size={15} color={C.mint} show={step >= 3}>motor neuron</T>
        <T x={384} y={140} size={14} color="#b07d00" show={step >= 3}>relay neuron</T>
        <T x={548} y={290} size={15} color={C.ink} show={step >= 4}>effector: muscle</T>
        <Pulse pts={sensory} show={step === 2} color={C.sky} dur={1.4} />
        <Pulse pts={[...sensory, ...relay.slice(1), ...motor.slice(1)]} show={step === 3 || step === 4} color={C.coral} dur={1.8} />
        <T x={200} y={330} size={16} color={C.coral} show={step === 4} delay={1.6}>hand pulls away!</T>
      </Show>
      <Show when={step === 5}>
        <path d="M60 150 Q 200 150 260 140 Q 300 130 300 180 Q 300 230 260 220 Q 200 210 60 210 Z" fill={C.skySoft} stroke={C.sky} strokeWidth={3} />
        <path d="M580 150 Q 440 150 380 140 Q 340 130 340 180 Q 340 230 380 220 Q 440 210 580 210 Z" fill={C.mintSoft} stroke={C.mint} strokeWidth={3} />
        {[150, 168, 186, 204].map((y, i) => (
          <Pulse key={y} pts={[[300, y], [342, y + 4]]} show={step === 5} color={C.pink} r={5} dur={1.1} delay={i * 0.25} />
        ))}
        <T x={320} y={90} size={20} weight={700}>synapse (the gap)</T>
        <Arrow x1={320} y1={102} x2={320} y2={128} color={C.ink} />
        <T x={320} y={270} size={16} color={C.pink}>neurotransmitters carry the signal across</T>
        <T x={150} y={240} size={15} color={C.sky}>neuron 1</T>
        <T x={490} y={240} size={15} color={C.mint}>neuron 2</T>
      </Show>
    </g>
  )
}

export const nervous: SceneDef = {
  id: 'nervous',
  title: 'The nervous system',
  steps: [
    'Your nervous system is your body’s super-fast messaging network. It detects changes, called stimuli, and responds in a fraction of a second.',
    'It starts with a receptor. Touch a hot pan, and heat receptors in your skin detect the stimulus.',
    'A sensory neuron carries an electrical impulse from the receptor to your spinal cord.',
    'In a reflex, a relay neuron in the spinal cord passes the message straight to a motor neuron — without waiting for the brain to decide.',
    'The motor neuron carries the impulse to an effector, your arm muscle, which contracts and pulls your hand away. All before you even feel the pain!',
    'Neurons don’t quite touch. At each tiny gap, called a synapse, chemicals called neurotransmitters carry the signal across.',
  ],
  Comp: Nervous,
}

// ---------------- Hormones & homeostasis ----------------
function Hormones({ step }: { step: number }) {
  const loop: Pt[] = [[230, 110], [410, 110], [410, 300], [230, 300], [230, 110]]
  const glands: [number, number, string][] = [[320, 66, 'pituitary'], [320, 128, 'thyroid'], [300, 212, 'adrenal'], [340, 236, 'pancreas']]
  const top = 70
  const bottom = 300
  const lvl = (t: number) => bottom - ((t - 33) / 9) * (bottom - top)
  return (
    <g>
      <Show when={step <= 1}>
        <circle cx={320} cy={66} r={34} fill="#ffe8d6" stroke="#e0a57a" strokeWidth={2.5} />
        <rect x={272} y={104} width={96} height={190} rx={36} fill="#ffe8d6" stroke="#e0a57a" strokeWidth={2.5} />
        <path d={`M${loop.map((p) => p.join(' ')).join(' L')}`} fill="none" stroke={C.coral} strokeWidth={3} strokeDasharray="6 6" opacity={0.6} />
        {[0, 0.6, 1.2].map((d) => (
          <Pulse key={d} pts={loop} color={C.coral} r={6} dur={3.6} delay={d} />
        ))}
        {glands.map(([x, y, n], i) => (
          <g key={n}>
            <circle cx={x} cy={y} r={9} fill={C.violet} stroke="white" strokeWidth={2} />
            <text x={i % 2 ? 470 : 170} y={y + 5} fontSize={15} fontWeight={600} fill={C.violet} textAnchor="middle">{n}</text>
            <line x1={i % 2 ? 440 : 205} y1={y} x2={x + (i % 2 ? 10 : -10)} y2={y} stroke={C.violet} strokeWidth={1.5} strokeDasharray="3 3" />
          </g>
        ))}
        <T x={320} y={334} size={16} color={C.coral}>hormones travel in the blood</T>
      </Show>
      <Show when={step === 1}>
        <circle cx={565} cy={180} r={48} fill={C.mintSoft} stroke={C.mint} strokeWidth={3} />
        <path d="M565 132 l-10 -1 l10 -16 l10 16 z" fill="white" stroke={C.mint} strokeWidth={2} />
        <motion.path d="M0 0 l10 16 l-20 0 z" fill={C.violet} initial={{ x: 600, y: 40 }} animate={step === 1 ? { x: [610, 565], y: [40, 116] } : {}} transition={{ duration: 1.4, delay: 0.6 }} />
        <T x={565} y={252} size={15} color={C.mint}>target cell</T>
        <T x={545} y={276} size={13} color={C.soft}>the hormone fits its receptor</T>
      </Show>
      <Show when={step === 2 || step === 3}>
        <rect x={150} y={top - 20} width={36} height={bottom - top + 40} rx={18} fill="white" stroke={C.soft} strokeWidth={3} />
        <circle cx={168} cy={bottom + 30} r={28} fill={C.coral} />
        <rect x={130} y={lvl(37.5)} width={76} height={lvl(36.5) - lvl(37.5)} fill={C.mint} opacity={0.25} />
        <motion.rect x={158} width={20} fill={C.coral} initial={false} animate={step === 3 ? { y: [lvl(37), lvl(39.5), lvl(37), lvl(35), lvl(37)], height: [bottom + 20 - lvl(37), bottom + 20 - lvl(39.5), bottom + 20 - lvl(37), bottom + 20 - lvl(35), bottom + 20 - lvl(37)] } : { y: lvl(37), height: bottom + 20 - lvl(37) }} transition={step === 3 ? { duration: 7, repeat: Infinity } : { duration: 0.6 }} />
        {[35, 37, 39, 41].map((t) => (
          <text key={t} x={220} y={lvl(t) + 5} fontSize={14} fill={t === 37 ? C.mint : C.soft} fontWeight={t === 37 ? 800 : 500}>{t} °C</text>
        ))}
        <T x={420} y={110} size={22} weight={800} show={step === 2}>normal ≈ 37 °C</T>
        <T x={420} y={150} size={16} color={C.soft} show={step === 2}>like a thermostat</T>
        <Emo x={360} y={110} e="🥵" size={40} show={step === 3} />
        <T x={480} y={104} size={16} color={C.coral} show={step === 3}>too hot → sweat,</T>
        <T x={480} y={128} size={16} color={C.coral} show={step === 3}>vessels widen</T>
        <Emo x={360} y={240} e="🥶" size={40} show={step === 3} delay={0.4} />
        <T x={480} y={234} size={16} color={C.sky} show={step === 3} delay={0.4}>too cold → shiver,</T>
        <T x={480} y={258} size={16} color={C.sky} show={step === 3} delay={0.4}>vessels narrow</T>
      </Show>
      <Show when={step >= 4}>
        <line x1={80} y1={300} x2={580} y2={300} stroke={C.soft} strokeWidth={2} />
        <line x1={80} y1={60} x2={80} y2={300} stroke={C.soft} strokeWidth={2} />
        <rect x={80} y={180} width={500} height={50} fill={C.mint} opacity={0.15} />
        <text x={575} y={248} fontSize={13} fill={C.mint} textAnchor="end" fontWeight={700}>normal range</text>
        <Draw d="M80 205 L180 205 C 220 205 230 90 260 90 C 300 90 320 205 380 205 L580 205" show={step >= 4} color={C.violet} width={4} />
        <Emo x={190} y={255} e="🍝" size={30} />
        <T x={190} y={282} size={13} color={C.soft}>meal</T>
        <T x={300} y={78} size={15} color={C.coral} delay={0.8}>pancreas releases insulin</T>
        <Arrow x1={300} y1={92} x2={318} y2={150} color={C.coral} delay={0.8} />
        <T x={330} y={332} size={14} color={C.soft}>time →</T>
        <text x={40} y={180} fontSize={13} fill={C.soft} textAnchor="middle" transform="rotate(-90 40 180)">blood glucose</text>
        <Pill x={480} y={120} text="negative feedback" color={C.mint} size={15} delay={1.2} />
      </Show>
    </g>
  )
}

export const hormones: SceneDef = {
  id: 'hormones',
  title: 'Hormones & homeostasis',
  steps: [
    'Hormones are chemical messengers. Glands like the pituitary, thyroid, adrenal glands and pancreas release them into the blood, which carries them around the body.',
    'Only target cells with the right receptors respond — like a key that fits just one lock.',
    'Homeostasis keeps conditions inside your body steady, like a thermostat. Your temperature stays close to 37 degrees.',
    'Too hot? You sweat, and blood vessels near your skin widen to lose heat. Too cold? You shiver, and those vessels narrow to keep heat in.',
    'After a meal, blood glucose rises. The pancreas releases insulin, and glucose falls back to normal. A change is detected and reversed — that’s negative feedback.',
  ],
  Comp: Hormones,
}

// ---------------- Disease & immunity ----------------
function Virus({ x, y, r = 18, color = C.coral }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2
        return <line key={i} x1={x + r * Math.cos(a)} y1={y + r * Math.sin(a)} x2={x + (r + 8) * Math.cos(a)} y2={y + (r + 8) * Math.sin(a)} stroke={color} strokeWidth={3} strokeLinecap="round" />
      })}
      <circle cx={x} cy={y} r={r} fill={C.coralSoft} stroke={color} strokeWidth={3} />
    </g>
  )
}
function Bacterium({ x, y }: { x: number; y: number }) {
  return <rect x={x - 26} y={y - 12} width={52} height={24} rx={12} fill="#d8f5d0" stroke="#3fa34d" strokeWidth={3} />
}
function Antibody({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 0 L0 24 M0 0 L-10 -12 M0 0 L10 -12" stroke={C.violet} strokeWidth={4} strokeLinecap="round" fill="none" />
    </g>
  )
}
function Immunity({ step }: { step: number }) {
  return (
    <g>
      <Show when={step === 0}>
        <Bacterium x={110} y={180} />
        <Virus x={250} y={180} />
        <Emo x={390} y={180} e="🍄" size={46} />
        <Emo x={530} y={180} e="🪱" size={46} />
        {['bacteria', 'viruses', 'fungi', 'parasites'].map((n, i) => (
          <text key={n} x={110 + i * 140} y={240} fontSize={17} fontWeight={700} fill={C.ink} textAnchor="middle">{n}</text>
        ))}
        <T x={320} y={90} size={22} weight={800}>pathogens cause disease</T>
      </Show>
      <Show when={step === 1}>
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={300} y={60 + i * 50} width={44} height={46} fill="#e8d9c4" stroke="#b9a27f" strokeWidth={2} />
        ))}
        {[110, 190, 270].map((y, i) => (
          <motion.g key={y} initial={false} animate={step === 1 ? { x: [0, 150, 0] } : { x: 0 }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}>
            {i === 1 ? <Bacterium x={130} y={y} /> : <Virus x={130} y={y} r={14} />}
          </motion.g>
        ))}
        <T x={322} y={40} size={16} weight={700}>first line of defence</T>
        {['🧱 skin', '💧 mucus & cilia', '🧪 stomach acid', '😢 tears & saliva'].map((t, i) => (
          <text key={t} x={400} y={120 + i * 40} fontSize={18} fontWeight={600} fill={C.ink}>{t}</text>
        ))}
      </Show>
      <Show when={step === 2}>
        <motion.g initial={false} animate={step === 2 ? { opacity: [1, 1, 0], scale: [1, 1, 0.3] } : { opacity: 1, scale: 1 }} transition={{ duration: 2.6, times: [0, 0.6, 1] }}>
          <Bacterium x={430} y={180} />
        </motion.g>
        <motion.circle r={56} fill="rgba(98,70,234,0.18)" stroke={C.violet} strokeWidth={3} initial={false} animate={step === 2 ? { cx: [200, 410], cy: 180 } : { cx: 200, cy: 180 }} transition={{ duration: 1.8 }} />
        <T x={200} y={270} size={18} color={C.violet} weight={700}>phagocyte</T>
        <T x={440} y={270} size={16} color="#3fa34d">bacterium</T>
        <T x={320} y={60} size={18} weight={700}>engulf and digest!</T>
      </Show>
      <Show when={step === 3}>
        <Virus x={320} y={180} r={30} />
        {[0, 60, 120, 180, 240, 300].map((a, i) => {
          const r = (a * Math.PI) / 180
          return (
            <motion.g key={a} initial={false} animate={step === 3 ? { x: [Math.cos(r) * 120, Math.cos(r) * 52], y: [Math.sin(r) * 120, Math.sin(r) * 52] } : {}} transition={{ duration: 1.2, delay: 0.4 + i * 0.2 }}>
              <Antibody x={320} y={180} rot={a + 90} />
            </motion.g>
          )
        })}
        <T x={500} y={100} size={17} color={C.violet} weight={700}>antibodies</T>
        <T x={500} y={124} size={14} color={C.soft}>made by lymphocytes</T>
        <T x={150} y={260} size={17} color={C.coral} weight={700}>antigens</T>
        <T x={150} y={284} size={14} color={C.soft}>markers on the pathogen</T>
        <T x={320} y={330} size={16}>each antibody fits one antigen — like a key</T>
      </Show>
      <Show when={step === 4}>
        <line x1={70} y1={300} x2={590} y2={300} stroke={C.soft} strokeWidth={2} />
        <line x1={70} y1={60} x2={70} y2={300} stroke={C.soft} strokeWidth={2} />
        <Draw d="M70 300 C 130 300 150 240 190 240 C 230 240 240 300 300 300 L 380 300 C 400 300 410 90 440 90 C 480 90 500 280 590 290" show={step === 4} color={C.violet} width={4} />
        <T x={180} y={220} size={14} color={C.soft}>1st infection: slow, small</T>
        <T x={460} y={72} size={14} color={C.violet} weight={700}>2nd time: fast and big!</T>
        <T x={320} y={330} size={14} color={C.soft}>time →</T>
        <text x={36} y={180} fontSize={13} fill={C.soft} textAnchor="middle" transform="rotate(-90 36 180)">antibody level</text>
        <Pill x={190} y={120} text="memory cells" color={C.mint} size={15} delay={0.6} />
        <Pill x={190} y={170} text="vaccines work this way" color={C.sky} size={14} delay={1.2} />
      </Show>
    </g>
  )
}

export const immunity: SceneDef = {
  id: 'immunity',
  title: 'Disease & immunity',
  steps: [
    'Pathogens are microbes that cause disease: bacteria, viruses, fungi and parasites.',
    'Your first line of defence keeps them out: skin, mucus and cilia in your airways, stomach acid, and the enzymes in tears and saliva.',
    'If pathogens get in, white blood cells called phagocytes engulf and digest them.',
    'Other white blood cells, called lymphocytes, make antibodies. Each antibody fits one antigen — a marker on the pathogen — like a key in a lock.',
    'Memory cells remember the pathogen. Next time, antibodies are made so fast and in such numbers that you don’t get sick. That’s immunity — and it’s how vaccines work.',
  ],
  Comp: Immunity,
}

// ---------------- Ecosystems ----------------
function Ecosystems({ step }: { step: number }) {
  const chain: [string, string][] = [['🌱', 'producer'], ['🦗', 'herbivore'], ['🐸', 'carnivore'], ['🐍', 'top predator']]
  const energy = ['10 000', '1000', '100', '10']
  const h = [150, 70, 30, 10]
  return (
    <g>
      <Show when={step === 0}>
        <Emo x={110} y={80} e="☀️" size={70} />
        {[0, 1, 2].map((i) => (
          <Arrow key={i} x1={150 + i * 10} y1={110 + i * 6} x2={290 + i * 20} y2={230 - i * 10} color={C.sun} width={4} delay={i * 0.2} />
        ))}
        <Emo x={340} y={270} e="🌱" size={70} />
        <T x={460} y={250} size={18} weight={700} color="#3fa34d" anchor="start">producer</T>
        <T x={460} y={276} size={14} color={C.soft} anchor="start">photosynthesis</T>
      </Show>
      <Show when={step === 1 || step === 2}>
        {chain.map(([e, n], i) => (
          <g key={n}>
            <Emo x={100 + i * 145} y={270} e={e} size={52} delay={step === 1 ? i * 0.5 : 0} />
            <T x={100 + i * 145} y={318} size={14} color={C.soft}>{n}</T>
            {i < 3 && <Arrow x1={135 + i * 145} y1={270} x2={208 + i * 145} y2={270} color={C.ink} delay={step === 1 ? i * 0.5 + 0.3 : 0} />}
          </g>
        ))}
      </Show>
      <Show when={step === 2}>
        {energy.map((e, i) => (
          <g key={e}>
            <Box x={80 + i * 145} y={225 - h[i]} w={40} h={h[i]} fill={C.sunSoft} stroke={C.sun} show={step === 2} delay={i * 0.4} />
            <T x={100 + i * 145} y={215 - h[i] - 8} size={14} weight={700} show={step === 2} delay={i * 0.4}>{e} kJ</T>
            {i < 3 && <T x={172 + i * 145} y={200 - h[i + 1]} size={13} color={C.coral} show={step === 2} delay={i * 0.4 + 0.3}>♨ 90% lost</T>}
          </g>
        ))}
      </Show>
      <Show when={step === 3}>
        {[400, 290, 180, 80].map((w, i) => (
          <Box key={w} x={320 - w / 2} y={270 - i * 56} w={w} h={50} fill={['#d8f5d0', '#e1ecff', '#fff3cc', '#ffe5e5'][i]} stroke={['#3fa34d', C.sky, C.sun, C.coral][i]} delay={i * 0.3} />
        ))}
        {chain.map(([e], i) => (
          <Emo key={e} x={320} y={296 - i * 56} e={e} size={28} delay={i * 0.3} />
        ))}
        <T x={560} y={100} size={16} color={C.soft}>less energy</T>
        <T x={560} y={122} size={16} color={C.soft}>at each level</T>
      </Show>
      <Show when={step >= 4}>
        {([[320, 60, '☁️ CO₂ in air'], [520, 180, '🌳 plants'], [320, 300, '🐄 animals'], [120, 180, '🍄 decomposers']] as const).map(([x, y, t]) => (
          <text key={t} x={x} y={y} fontSize={18} fontWeight={700} fill={C.ink} textAnchor="middle" dominantBaseline="middle">{t}</text>
        ))}
        <Arrow x1={380} y1={78} x2={490} y2={155} color="#3fa34d" />
        <Arrow x1={490} y1={208} x2={380} y2={285} color={C.sun} delay={0.3} />
        <Arrow x1={260} y1={285} x2={160} y2={208} color={C.soft} delay={0.6} />
        <Arrow x1={150} y1={155} x2={260} y2={78} color={C.coral} delay={0.9} />
        <T x={480} y={104} size={13} color="#3fa34d">photosynthesis</T>
        <T x={480} y={262} size={13} color="#b07d00">eating</T>
        <T x={160} y={262} size={13} color={C.soft}>death & waste</T>
        <T x={160} y={104} size={13} color={C.coral}>respiration</T>
        <Pill x={320} y={180} text="matter cycles" color={C.mint} size={16} delay={1.2} />
      </Show>
    </g>
  )
}

export const ecosystems: SceneDef = {
  id: 'ecosystems',
  title: 'Ecosystems & energy flow',
  steps: [
    'Every food chain starts with a producer — a plant that captures light energy from the Sun by photosynthesis.',
    'Energy passes along the chain when one organism eats another: grass, to grasshopper, to frog, to snake. The arrows show which way the energy flows.',
    'But only about ten percent of the energy passes on at each step. The rest is lost as heat, movement and waste.',
    'That’s why there are so few top predators. An energy pyramid shows it: wide at the bottom, narrow at the top.',
    'Matter, on the other hand, is recycled. Plants take carbon dioxide from the air, animals eat the plants, decomposers break down dead things, and respiration returns carbon dioxide to the air.',
  ],
  Comp: Ecosystems,
}

// ---------------- DNA ----------------
const BASES: [string, string][] = [['A', 'T'], ['T', 'A'], ['G', 'C'], ['C', 'G'], ['C', 'G'], ['A', 'T'], ['T', 'A'], ['G', 'C']]
const baseCol: Record<string, string> = { A: C.coral, T: C.sky, C: C.mint, G: C.sun }
function Chromo({ x, y, s = 1, color = C.violet }: { x: number; y: number; s?: number; color?: string }) {
  return <path d={`M${x - 10 * s} ${y - 18 * s} L${x + 10 * s} ${y + 18 * s} M${x + 10 * s} ${y - 18 * s} L${x - 10 * s} ${y + 18 * s}`} stroke={color} strokeWidth={6 * s} strokeLinecap="round" />
}
function Dna({ step }: { step: number }) {
  const helixA = Array.from({ length: 121 }, (_, i) => `${i ? 'L' : 'M'}${80 + i * 4} ${180 + 60 * Math.sin(i / 9.5)}`).join(' ')
  const helixB = Array.from({ length: 121 }, (_, i) => `${i ? 'L' : 'M'}${80 + i * 4} ${180 - 60 * Math.sin(i / 9.5)}`).join(' ')
  return (
    <g>
      <Show when={step === 0}>
        <circle cx={320} cy={180} r={150} fill="#fdf6ec" stroke="#e0c9a6" strokeWidth={3} />
        <circle cx={320} cy={180} r={68} fill={C.violetSoft} stroke={C.violet} strokeWidth={3} />
        {[[295, 160], [335, 150], [310, 200], [350, 195]].map(([x, y], i) => (
          <Chromo key={i} x={x} y={y} s={0.6} />
        ))}
        <T x={320} y={278} size={16} color={C.violet} weight={700}>nucleus</T>
        <T x={540} y={60} size={16} color={C.soft}>a body cell</T>
      </Show>
      <Show when={step === 1}>
        {Array.from({ length: 23 }, (_, i) => (
          <g key={i}>
            <Chromo x={70 + (i % 8) * 70} y={80 + Math.floor(i / 8) * 90} s={0.7 + ((i * 7) % 5) * 0.05} color={i === 22 ? C.pink : C.violet} />
            <Chromo x={92 + (i % 8) * 70} y={80 + Math.floor(i / 8) * 90} s={0.7 + ((i * 7) % 5) * 0.05} color={i === 22 ? C.sky : C.violet} />
          </g>
        ))}
        <Pill x={500} y={300} text="46 chromosomes = 23 pairs" color={C.violet} size={15} />
      </Show>
      <Show when={step === 2}>
        <Draw d={helixA} color={C.coral} width={5} show={step === 2} />
        <Draw d={helixB} color={C.sky} width={5} show={step === 2} delay={0.3} />
        {Array.from({ length: 24 }, (_, i) => {
          const x = 80 + i * 20
          const y1 = 180 + 60 * Math.sin((i * 5) / 9.5)
          return <line key={i} x1={x} y1={y1} x2={x} y2={360 - y1} stroke={C.soft} strokeWidth={2} opacity={0.5} />
        })}
        <T x={320} y={40} size={20} weight={700}>the double helix</T>
      </Show>
      <Show when={step === 3 || step === 4}>
        <line x1={60} y1={110} x2={580} y2={110} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        <line x1={60} y1={250} x2={580} y2={250} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        {BASES.map(([a, b], i) => {
          const x = 95 + i * 64
          return (
            <g key={i}>
              <rect x={x - 14} y={110} width={28} height={68} fill={baseCol[a]} rx={4} />
              <rect x={x - 14} y={182} width={28} height={68} fill={baseCol[b]} rx={4} />
              <text x={x} y={150} fontSize={20} fontWeight={800} fill="white" textAnchor="middle">{a}</text>
              <text x={x} y={222} fontSize={20} fontWeight={800} fill="white" textAnchor="middle">{b}</text>
            </g>
          )
        })}
        <T x={320} y={300} size={18} weight={700} show={step === 3}>A pairs with T · C pairs with G</T>
        <Show when={step === 4}>
          <path d="M140 96 L140 80 L370 80 L370 96" fill="none" stroke={C.violet} strokeWidth={3} />
          <T x={255} y={60} size={18} color={C.violet} weight={700}>a gene → codes for a protein</T>
          <T x={320} y={300} size={16} color={C.soft}>the order of the bases is the code</T>
        </Show>
      </Show>
      <Show when={step >= 5}>
        <circle cx={150} cy={95} r={36} fill={C.violetSoft} stroke={C.violet} strokeWidth={3} />
        <Arrow x1={135} y1={138} x2={105} y2={210} color={C.ink} />
        <Arrow x1={165} y1={138} x2={195} y2={210} color={C.ink} />
        <circle cx={95} cy={250} r={34} fill={C.violetSoft} stroke={C.violet} strokeWidth={3} />
        <circle cx={205} cy={250} r={34} fill={C.violetSoft} stroke={C.violet} strokeWidth={3} />
        <T x={150} y={316} size={16} weight={700} color={C.violet}>mitosis: 2 identical</T>
        <T x={150} y={340} size={13} color={C.soft}>growth & repair · 46 each</T>
        <circle cx={470} cy={95} r={36} fill={C.sunSoft} stroke={C.sun} strokeWidth={3} />
        {[380, 440, 500, 560].map((x, i) => (
          <g key={x}>
            <Arrow x1={470} y1={136} x2={x} y2={214} color={C.ink} delay={0.6} />
            <circle cx={x} cy={248} r={24} fill={['#ffe5e5', '#e1ecff', '#d9f6f3', '#fde4f3'][i]} stroke={C.sun} strokeWidth={3} />
          </g>
        ))}
        <T x={470} y={316} size={16} weight={700} color="#b07d00">meiosis: 4 different</T>
        <T x={470} y={340} size={13} color={C.soft}>sperm & eggs · 23 each</T>
      </Show>
    </g>
  )
}

export const dna: SceneDef = {
  id: 'dna',
  title: 'DNA, genes & cell division',
  steps: [
    'Inside the nucleus of almost every cell is DNA — the instructions for building and running you.',
    'DNA is packed into chromosomes. Human body cells have 46 of them, in 23 pairs — one of each pair from each parent.',
    'Unwind a chromosome and you find the double helix: a ladder twisted into a spiral.',
    'The rungs of the ladder are pairs of bases. Base A always pairs with base T, and base C always pairs with base G.',
    'A gene is a section of DNA that codes for a protein. The order of the bases is the code.',
    'Cells divide by mitosis to make two identical cells for growth and repair. Meiosis makes four different sex cells, each with half the chromosomes.',
  ],
  Comp: Dna,
}

// ---------------- Inheritance ----------------
function Tile({ x, y, a, color }: { x: number; y: number; a: string; color: string }) {
  return (
    <g>
      <rect x={x - 18} y={y - 18} width={36} height={36} rx={8} fill={color} />
      <text x={x} y={y + 7} fontSize={20} fontWeight={800} fill="white" textAnchor="middle" fontStyle="italic">{a}</text>
    </g>
  )
}
function Eye({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={38} ry={22} fill="white" stroke={C.ink} strokeWidth={2.5} />
      <circle cx={x} cy={y} r={15} fill={c} />
      <circle cx={x} cy={y} r={6} fill={C.ink} />
    </g>
  )
}
function Inheritance({ step }: { step: number }) {
  const cells = ['BB', 'Bb', 'Bb', 'bb']
  const s = 84
  const [x0, y0] = [250, 110]
  return (
    <g>
      <Show when={step === 0}>
        <Emo x={170} y={80} e="👩" size={56} />
        <Emo x={470} y={80} e="👨" size={56} />
        <Tile x={150} y={140} a="B" color={C.coral} />
        <Tile x={192} y={140} a="b" color={C.coral} />
        <Tile x={450} y={140} a="B" color={C.sky} />
        <Tile x={492} y={140} a="b" color={C.sky} />
        <Arrow x1={190} y1={170} x2={290} y2={250} color={C.ink} delay={0.5} />
        <Arrow x1={450} y1={170} x2={350} y2={250} color={C.ink} delay={0.5} />
        <Emo x={320} y={300} e="🧒" size={50} delay={0.8} />
        <Tile x={260} y={300} a="B" color={C.coral} />
        <Tile x={380} y={300} a="b" color={C.sky} />
        <T x={320} y={220} size={14} color={C.soft}>one allele from each parent</T>
      </Show>
      <Show when={step === 1}>
        {([['BB', '#7a4a1f', 'brown'], ['Bb', '#7a4a1f', 'brown'], ['bb', '#3a86ff', 'blue']] as const).map(([g, c, n], i) => (
          <g key={g}>
            <Eye x={150 + i * 170} y={160} c={c} />
            <text x={150 + i * 170} y={230} fontSize={26} fontWeight={800} textAnchor="middle" fontStyle="italic" fill={C.ink}>{g}</text>
            <text x={150 + i * 170} y={262} fontSize={16} textAnchor="middle" fill={C.soft}>{n} eyes</text>
          </g>
        ))}
        <T x={320} y={60} size={17} weight={700}>B (brown) is dominant · b (blue) is recessive</T>
      </Show>
      <Show when={step >= 2}>
        {['B', 'b'].map((a, i) => (
          <text key={'t' + a} x={x0 + s * i + s / 2} y={y0 - 16} fontSize={28} fontWeight={800} fill={C.sky} textAnchor="middle" fontStyle="italic">{a}</text>
        ))}
        {['B', 'b'].map((a, i) => (
          <text key={'s' + a} x={x0 - 24} y={y0 + s * i + s / 2 + 10} fontSize={28} fontWeight={800} fill={C.coral} textAnchor="middle" fontStyle="italic">{a}</text>
        ))}
        {cells.map((c, i) => (
          <g key={i}>
            <rect x={x0 + s * (i % 2)} y={y0 + s * Math.floor(i / 2)} width={s} height={s} fill={step >= 4 && c === 'bb' ? C.skySoft : C.violetSoft} stroke={step >= 4 && c === 'bb' ? C.sky : C.violet} strokeWidth={step >= 4 && c === 'bb' ? 5 : 2.5} />
            <T x={x0 + s * (i % 2) + s / 2} y={y0 + s * Math.floor(i / 2) + s / 2} size={26} weight={700} show={step >= 3} delay={step === 3 ? i * 0.5 : 0}>{c}</T>
          </g>
        ))}
        <T x={130} y={60} size={15} color={C.soft} show={step >= 2}>Bb × Bb</T>
        <Show when={step >= 4}>
          <Eye x={510} y={130} c="#7a4a1f" />
          <text x={510} y={180} fontSize={17} fontWeight={700} textAnchor="middle" fill={C.ink}>3 brown</text>
          <Eye x={510} y={240} c="#3a86ff" />
          <text x={510} y={290} fontSize={17} fontWeight={700} textAnchor="middle" fill={C.sky}>1 blue (25%)</text>
        </Show>
      </Show>
    </g>
  )
}

export const inheritance: SceneDef = {
  id: 'inheritance',
  title: 'Inheritance & Punnett squares',
  steps: [
    'You get two copies of every gene — one from each parent. The different versions of a gene are called alleles.',
    'A dominant allele, written with a capital letter, shows whenever it’s there. A recessive allele only shows if there are two of them. So B B and B b give brown eyes, but b b gives blue.',
    'Let’s cross two parents who both carry B and b. Put one parent’s alleles across the top of a Punnett square, and the other’s down the side.',
    'Fill each box with one allele from the top and one from the side: B B, B b, B b, and b b.',
    'Three boxes have at least one capital B, so brown eyes. One box is b b — blue eyes. That’s a 3 to 1 ratio: each child has a 25 percent chance of blue eyes.',
  ],
  Comp: Inheritance,
}

// ---------------- Evolution ----------------
function Moth({ x, y, shade }: { x: number; y: number; shade: string }) {
  return (
    <g>
      <ellipse cx={x - 11} cy={y} rx={13} ry={9} fill={shade} stroke="#00000030" strokeWidth={1} transform={`rotate(-20 ${x - 11} ${y})`} />
      <ellipse cx={x + 11} cy={y} rx={13} ry={9} fill={shade} stroke="#00000030" strokeWidth={1} transform={`rotate(20 ${x + 11} ${y})`} />
      <ellipse cx={x} cy={y} rx={3} ry={10} fill="#3b2f2a" />
    </g>
  )
}
function Evolution({ step }: { step: number }) {
  const moths = Array.from({ length: 12 }, (_, i) => ({ x: 170 + (i % 4) * 100, y: 90 + Math.floor(i / 4) * 85, shade: ['#f2ead8', '#d7ccb4', '#8c7f6c', '#3f362f'][i % 4], dark: i % 4 >= 2 }))
  return (
    <g>
      <Show when={step <= 2}>
        <motion.rect x={110} y={40} width={420} height={280} rx={20} initial={false} animate={{ fill: step >= 1 ? '#4a3f37' : '#e3d6bd' }} transition={{ duration: 1.2 }} />
        {moths.map((m, i) => (
          <motion.g key={i} initial={false} animate={{ opacity: step >= 1 && !m.dark ? 0 : 1 }} transition={{ duration: 0.6, delay: step >= 1 && !m.dark ? 1 + i * 0.12 : 0 }}>
            <Moth x={m.x} y={m.y} shade={m.shade} />
          </motion.g>
        ))}
        <motion.g initial={false} animate={step === 1 ? { x: [0, 420, 0] } : { x: 0 }} transition={{ duration: 4, repeat: step === 1 ? Infinity : 0 }}>
          <Emo x={90} y={60} e="🐦" size={44} show={step === 1} />
        </motion.g>
        {moths.filter((m) => m.dark).map((m, i) => (
          <Show key={'kid' + i} when={step === 2} delay={0.4 + i * 0.2}>
            <Moth x={m.x - 45} y={m.y + 30} shade={m.shade} />
          </Show>
        ))}
        <T x={320} y={340} size={16} color={C.soft} show={step === 0}>variation: pale to dark</T>
        <T x={320} y={340} size={16} color={C.coral} show={step === 1}>pale moths are easy to spot</T>
        <T x={320} y={340} size={16} color={C.mint} show={step === 2}>dark moths survive and breed</T>
      </Show>
      <Show when={step === 3}>
        {[50, 70, 85, 95].map((d, i) => (
          <g key={i}>
            <Box x={130 + i * 110} y={300 - d * 2.4} w={60} h={d * 2.4} fill="#4a3f37" stroke="#2c241f" delay={i * 0.3} />
            <Box x={130 + i * 110} y={300 - 240} w={60} h={240 - d * 2.4} fill="#efe4cf" stroke="#c9b894" delay={i * 0.3} />
            <text x={160 + i * 110} y={326} fontSize={14} textAnchor="middle" fill={C.soft}>gen {[1, 10, 20, 50][i]}</text>
          </g>
        ))}
        <T x={320} y={36} size={18} weight={700}>the population changes over generations</T>
      </Show>
      <Show when={step >= 4}>
        <Draw d="M320 330 L320 250 M320 250 L170 160 M320 250 L470 160 M170 160 L100 80 M170 160 L240 80 M470 160 L400 80 M470 160 L540 80" color={C.violet} width={5} show={step >= 4} />
        {(['🐟', '🦎', '🐦', '🐒'] as const).map((e, i) => (
          <Emo key={e} x={[100, 240, 400, 540][i]} y={58} e={e} size={38} delay={0.8 + i * 0.2} />
        ))}
        <T x={430} y={300} size={16} color={C.soft}>common ancestor</T>
        <Pill x={130} y={300} text="fossils · bones · DNA" color={C.mint} size={14} delay={1.4} />
      </Show>
    </g>
  )
}

export const evolution: SceneDef = {
  id: 'evolution',
  title: 'Evolution by natural selection',
  steps: [
    'In any population there is variation. These moths range from pale to dark.',
    'Now pollution darkens the tree bark. The pale moths stand out, and birds eat them first.',
    'The dark moths are camouflaged, so more of them survive to reproduce — passing on the alleles for dark wings.',
    'Over many generations, the population becomes mostly dark. That’s natural selection: variation, a struggle to survive, and inheritance.',
    'Evidence from fossils, similar bone structures and DNA shows that living things share common ancestors, branching apart over millions of years.',
  ],
  Comp: Evolution,
}
